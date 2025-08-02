
import { GoogleGenAI, Type } from "@google/genai";
import { AllLoanInputs, FinancialAdvice, FinancialProduct, LoanCalculations, PortfolioItem } from '../types';

// Get API key from environment variables (supports both development and production)
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey });

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
    return portfolio.map(item => `- ${item.name}: ${parseFloat(item.amount) || 0} EUR (Rendimento annuo atteso: ${parseFloat(item.returnRate) || 0}%)`).join('\n');
}

export const getFinancialAdvice = async (inputs: AllLoanInputs, product: FinancialProduct, calculations: LoanCalculations): Promise<FinancialAdvice> => {
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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.3,
            },
        });

        const jsonText = response.text?.trim();

        if (!jsonText) {
            console.error("Risposta vuota dal modello AI");
            throw new Error("Il modello AI ha restituito una risposta vuota. Riprova.");
        }
        
        // Although responseMimeType is set, LLMs can sometimes wrap output in markdown.
        // This cleaning step adds robustness.
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        const parsedResponse = JSON.parse(cleanedJsonText);

        return parsedResponse as FinancialAdvice;

    } catch (error) {
        console.error("Errore nel recuperare o analizzare la consulenza da Gemini:", error);
        if (error instanceof SyntaxError) {
            // Catches JSON.parse errors
            throw new Error("Il modello AI ha restituito una risposta malformata. Impossibile analizzare i dati.");
        }
        // For other errors (API connection, etc.)
        throw new Error("Non è stato possibile contattare il servizio di consulenza AI. Controlla la tua connessione e riprova.");
    }
};
