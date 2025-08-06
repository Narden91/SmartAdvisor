
import { GoogleGenAI, Type } from "@google/genai";
import { AllLoanInputs, FinancialAdvice, FinancialProduct, LoanCalculations, PortfolioItem } from '../types';
import { isDomainAllowed, sanitizeInput } from '../security.config';
import RateLimitService from './rateLimitService';

// Get API key from environment variables (supports both development and production)
const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.");
}

// Validate API endpoint domain for security
const GEMINI_API_DOMAIN = 'https://generativelanguage.googleapis.com';
if (!isDomainAllowed(GEMINI_API_DOMAIN)) {
    throw new Error("Gemini API domain not allowed by security policy.");
}

const ai = new GoogleGenAI({ apiKey });

// Initialize rate limiting service
const rateLimitService = RateLimitService.getInstance();

// Enhanced error handling with retry logic
class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public retryAfter?: number,
        public isRateLimited?: boolean
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Request retry utility with exponential backoff
const retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            
            // Don't retry rate limit errors or client errors
            if (error instanceof APIError && (error.isRateLimited || (error.statusCode && error.statusCode >= 400 && error.statusCode < 500))) {
                throw error;
            }
            
            if (attempt === maxRetries) {
                rateLimitService.recordFailure();
                throw lastError;
            }
            
            // Exponential backoff with jitter
            const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 1000, 30000);
            console.warn(`[GeminiService] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recommendation: {
            type: Type.STRING,
            enum: ['PRESTITO', 'RISPARMI', 'INDOCISO'],
            description: "La raccomandazione finale. 'PRESTITO' se conviene fare il finanziamento, 'RISPARMI' se conviene usare i risparmi."
        },
        summary: {
            type: Type.STRING,
            description: "Un riassunto breve, di una frase, della raccomandazione."
        },
        detailedAnalysis: {
            type: Type.STRING,
            description: "Un paragrafo che spiega il ragionamento dietro la raccomandazione. Confronta il costo opportunità dell'uso dei risparmi (guadagni da investimento) con il costo finale totale del finanziamento. Considera un tasso di inflazione tipico del 3%. Sii specifico su quali fondi (liquidi o investiti) sarebbe meglio usare se la raccomandazione è 'RISPARMI'."
        },
        projectedInvestmentGrowth: {
            type: Type.NUMBER,
            description: "Il profitto totale previsto dall'investimento dell'importo richiesto per la durata del finanziamento. Questo è il valore futuro meno il capitale iniziale."
        }
    },
    required: ['recommendation', 'summary', 'detailedAnalysis', 'projectedInvestmentGrowth']
};

const getPromptContext = (product: FinancialProduct): string => {
    switch (product) {
        case 'Prestito':
            return "Sto valutando di richiedere un prestito personale.";
        case 'Finanziaria':
            return "Sto valutando di aprire un finanziamento (cessione del quinto).";
        case 'Mutuo':
            return "Sto valutando di accendere un mutuo per l'acquisto di un immobile.";
    }
}

const formatPortfolioForPrompt = (portfolio: PortfolioItem[]): string => {
    if (portfolio.length === 0) {
        return "Nessun investimento nel portafoglio.";
    }
    return portfolio.map(item => {
        // Sanitize portfolio item names to prevent injection
        const safeName = sanitizeInput(item.name);
        const amount = parseFloat(item.amount) || 0;
        const returnRate = parseFloat(item.returnRate) || 0;
        return `- ${safeName}: ${amount} EUR (Rendimento annuo atteso: ${returnRate}%)`;
    }).join('\n');
}

export const getFinancialAdvice = async (inputs: AllLoanInputs, product: FinancialProduct, calculations: LoanCalculations): Promise<FinancialAdvice> => {
    // Estimate request size for rate limiting
    const requestSize = JSON.stringify({ inputs, product, calculations }).length;
    
    // Check rate limits before making API call
    const rateLimitCheck = await rateLimitService.checkRateLimit(requestSize, 'gemini-api');
    
    if (!rateLimitCheck.allowed) {
        const error = new APIError(
            rateLimitCheck.reason || 'Rate limit exceeded',
            429,
            rateLimitCheck.retryAfter,
            true
        );
        throw error;
    }

    const { capitale, durataMesi, liquidSavings, portfolio } = inputs;

    // Calculate total investments and weighted average return
    const totalInvested = portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalAssets = (parseFloat(liquidSavings) || 0) + totalInvested;
    const weightedAverageReturn = portfolio.length > 0 && totalInvested > 0 ? portfolio.reduce((sum, item) => {
        const amount = parseFloat(item.amount) || 0;
        const rate = parseFloat(item.returnRate) || 0;
        return sum + (amount * rate);
    }, 0) / totalInvested : 0;
    
    const context = getPromptContext(product);
    
    const prompt = `
        Agisci come un consulente finanziario esperto per un pubblico italiano. ${context}
        Ho bisogno di prendere una decisione per un importo di ${capitale} EUR.
        
        Ecco la mia situazione finanziaria dettagliata:
        - Risparmi liquidi (non investiti): ${liquidSavings} EUR
        - Portafoglio di investimenti:
          ${formatPortfolioForPrompt(portfolio)}
        - Totale investimenti: ${totalInvested.toFixed(2)} EUR
        - Totale patrimonio (liquidi + investimenti): ${totalAssets.toFixed(2)} EUR
        - Rendimento medio ponderato annuo del portafoglio: ${weightedAverageReturn.toFixed(2)}%

        Ho calcolato il costo totale del finanziamento richiesto. Ecco i dettagli:
        - Tipo di Finanziamento: ${product}
        - Importo Richiesto: ${capitale} EUR
        - Durata: ${durataMesi} mesi
        - **Costo Finale Totale del Finanziamento (interessi + tutte le spese): ${calculations.costoFinale.toFixed(2)} EUR**

        Analizza i seguenti due scenari:
        1.  **Richiedere il Finanziamento:** Prendo il finanziamento. Il costo totale sarà di ${calculations.costoFinale.toFixed(2)} EUR. I miei risparmi e investimenti rimangono intatti, continuando a generare rendimenti.
        2.  **Usare i Risparmi:** Uso ${capitale} EUR dal mio patrimonio per effettuare la spesa. Ciò ridurrà i miei asset e quindi il mio potenziale di guadagno futuro.

        Basandoti su un'analisi finanziaria completa, confronta il **Costo Finale Totale del Finanziamento** con il **costo opportunità** dell'utilizzo dei miei fondi. Il costo opportunità è il potenziale guadagno a cui rinuncerei se disinvestissi o usassi i miei risparmi liquidi.
        
        Se consigli di usare i risparmi, specifica se è meglio usare prima i risparmi liquidi (a rendimento zero) o se è conveniente liquidare parte degli investimenti (e quali, se possibile).
        
        Assumi un tasso di inflazione standard di circa il 3% annuo nel tuo ragionamento.
        
        Calcola il **profitto netto** (guadagno totale meno il capitale iniziale) che otterrei investendo ${capitale} EUR per ${durataMesi} mesi con un rendimento annuo del ${weightedAverageReturn.toFixed(2)}%. Questo rappresenta il costo opportunità principale. Forniscilo nel campo 'projectedInvestmentGrowth'.
        
        Fornisci la tua risposta in formato JSON secondo lo schema definito.
    `;

    try {
        const response = await retryWithBackoff(async () => {
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.3,
                },
            });
            
            // Record successful API call
            rateLimitService.recordFailure(); // Reset failure count on success
            return result;
        });

        const jsonText = response.text?.trim();

        if (!jsonText) {
            throw new Error("Il modello AI ha restituito una risposta vuota. Riprova.");
        }
        
        // Although responseMimeType is set, LLMs can sometimes wrap output in markdown.
        // This cleaning step adds robustness.
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        const parsedResponse = JSON.parse(cleanedJsonText);

        return parsedResponse as FinancialAdvice;

    } catch (error) {
        // Record API failure for circuit breaker
        rateLimitService.recordFailure();
        
        if (error instanceof APIError) {
            // Re-throw API errors with rate limit information
            throw error;
        }
        
        if (error instanceof SyntaxError) {
            // Catches JSON.parse errors
            throw new APIError("Il modello AI ha restituito una risposta malformata. Impossibile analizzare i dati.", 422);
        }
        
        // For other errors (API connection, etc.)
        const message = error instanceof Error ? error.message : "Errore sconosciuto";
        
        // Check if it's a rate limit error from the API
        if (message.includes('quota') || message.includes('rate') || message.includes('limit')) {
            throw new APIError("Limite di richieste API raggiunto. Riprova tra qualche minuto.", 429, 300, true);
        }
        
        // Check for network/connectivity issues
        if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            throw new APIError("Problemi di connessione. Verifica la tua connessione internet e riprova.", 503);
        }
        
        // Check for authentication issues
        if (message.includes('auth') || message.includes('permission') || message.includes('unauthorized')) {
            throw new APIError("Problema di autenticazione con il servizio AI. Contatta il supporto tecnico.", 401);
        }
        
        throw new APIError("Non è stato possibile contattare il servizio di consulenza AI. Controlla la tua connessione e riprova.", 503);
    }
};
