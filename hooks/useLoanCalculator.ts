import { useState, useCallback } from 'react';
import { AllLoanInputs, LoanCalculations, FinancialAdvice, ChartData, FinancialProduct, PortfolioItem } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { sanitizeInput, validateNumericInput } from '../security.config';

const initialInputs: AllLoanInputs = {
    capitale: '15000',
    tan: '7.5',
    durataMesi: '60',
    speseIstruttoria: '200',
    costiAssicurativi: '0',
    speseIncassoRata: '2',
    premioAssicurativo: '15',
    commissioniIntermediazione: '300',
    speseGestionePratica: '150',
    spread: '1.5',
    parametroRiferimento: '2.0',
    costiNotarili: '2500',
    assicurazioneObbligatoria: '20',
    impostaSostitutiva: '500',
    liquidSavings: '5000',
    portfolio: [],
};

export const useLoanCalculator = () => {
    const [product, setProduct] = useState<FinancialProduct>('Prestito');
    const [inputs, setInputs] = useState<AllLoanInputs>(initialInputs);
    const [calculations, setCalculations] = useState<LoanCalculations | null>(null);
    const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Utility function for sanitizing numeric inputs
    const sanitizeNumericInput = useCallback((value: string): string => {
        // Remove any non-numeric characters except decimal point
        return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }, []);

    // Handle input changes with proper sanitization
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Sanitize decimal inputs
        if (e.target.inputMode === 'decimal' && value) {
            const sanitized = sanitizeNumericInput(value);
            if (!/^\d*\.?\d*$/.test(sanitized)) {
                return;
            }
            setInputs(prev => ({ ...prev, [name]: sanitized }));
        } else {
            // For non-decimal inputs, still sanitize using centralized utility
            const sanitized = sanitizeInput(value);
            setInputs(prev => ({ ...prev, [name]: sanitized }));
        }
    }, [sanitizeNumericInput]);

    // Handle portfolio changes with validation
    const handlePortfolioChange = useCallback((id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => {
        setInputs(prev => ({
            ...prev,
            portfolio: prev.portfolio.map(item => {
                if (item.id === id) {
                    let sanitizedValue = value;
                    
                    // Sanitize based on field type
                    if (field === 'amount' || field === 'returnRate') {
                        sanitizedValue = sanitizeNumericInput(value);
                        // Validate numeric constraints
                        if (field === 'amount' && !validateNumericInput(sanitizedValue, 0, 999999999)) {
                            return item; // Keep previous value if invalid
                        }
                        if (field === 'returnRate' && !validateNumericInput(sanitizedValue, -100, 100)) {
                            return item; // Keep previous value if invalid
                        }
                    } else if (field === 'name') {
                        // Sanitize text input using centralized security utility
                        sanitizedValue = sanitizeInput(value);
                    }
                    
                    return { ...item, [field]: sanitizedValue };
                }
                return item;
            })
        }));
    }, [sanitizeNumericInput, validateNumericInput]);

    // Add portfolio item
    const addPortfolioItem = useCallback(() => {
        setInputs(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { 
                id: Date.now().toString(), 
                name: '', 
                amount: '', 
                returnRate: '' 
            }]
        }));
    }, []);

    // Remove portfolio item
    const removePortfolioItem = useCallback((id: string) => {
        setInputs(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter(item => item.id !== id)
        }));
    }, []);

    // Handle product change with defaults
    const handleProductChange = useCallback((newProduct: FinancialProduct) => {
        setProduct(newProduct);
        const newDefaults: Partial<AllLoanInputs> = {};
        if (newProduct === 'Mutuo') {
            newDefaults.capitale = '200000';
            newDefaults.durataMesi = '300';
            newDefaults.spread = '1.5';
            newDefaults.parametroRiferimento = '2.5';
        } else if (newProduct === 'Prestito') {
            newDefaults.capitale = '15000';
            newDefaults.durataMesi = '60';
            newDefaults.tan = '7.5';
        } else {
            newDefaults.capitale = '8000';
            newDefaults.durataMesi = '36';
            newDefaults.tan = '9.0';
        }
        setInputs(prev => ({ ...initialInputs, ...newDefaults, liquidSavings: prev.liquidSavings, portfolio: prev.portfolio }));
        
        setCalculations(null);
        setAdvice(null);
        setChartData([]);
        setError(null);
    }, []);

    // Loan calculation logic
    const calculateLoan = useCallback((currentProduct: FinancialProduct, currentInputs: AllLoanInputs): LoanCalculations => {
        const getNum = (val: string) => parseFloat(val) || 0;

        const C = getNum(currentInputs.capitale);
        const n = getNum(currentInputs.durataMesi);

        const calculateRate = (principal: number, monthlyRate: number, periods: number): number => {
            if (principal <= 0 || periods <= 0) return 0;
            if (monthlyRate <= 0) return principal / periods;
            const powerTerm = Math.pow(1 + monthlyRate, periods);
            return principal * (monthlyRate * powerTerm) / (powerTerm - 1);
        };

        switch (currentProduct) {
            case 'Prestito': {
                const i = getNum(currentInputs.tan) / 100;
                const SI = getNum(currentInputs.speseIstruttoria);
                const CA = getNum(currentInputs.costiAssicurativi);
                const SIR = getNum(currentInputs.speseIncassoRata);
                
                const R = calculateRate(C, i / 12, n);
                const CTI = (R * n) - C;
                const CF = CTI + SI + CA + (SIR * n);

                return { rataMensile: R, costoTotaleInteressi: CTI, costoFinale: CF };
            }
            case 'Finanziaria': {
                const i = getNum(currentInputs.tan) / 100;
                const PA = getNum(currentInputs.premioAssicurativo);
                const CI = getNum(currentInputs.commissioniIntermediazione);
                const SGP = getNum(currentInputs.speseGestionePratica);

                const R = calculateRate(C, i / 12, n);
                const CAT = PA * n;
                const CTI = (R * n) - C;
                const CF = CTI + CI + SGP + CAT;

                return { rataMensile: R, costoAssicurativoTotale: CAT, costoFinale: CF };
            }
            case 'Mutuo': {
                const s = getNum(currentInputs.spread);
                const p = getNum(currentInputs.parametroRiferimento);
                const SI = getNum(currentInputs.speseIstruttoria);
                const CN = getNum(currentInputs.costiNotarili);
                const AO = getNum(currentInputs.assicurazioneObbligatoria);
                const IS = getNum(currentInputs.impostaSostitutiva);

                const tanEffettivo = p + s;
                const tanDecimal = tanEffettivo / 100;

                const R = calculateRate(C, tanDecimal / 12, n);
                const IT = (R * n) - C;
                const CF = IT + SI + CN + (AO * n) + IS;
                
                return { tanEffettivo, rataMensile: R, interessiTotali: IT, costoFinale: CF };
            }
            default:
                throw new Error(`Calcolo non implementato per il prodotto: ${currentProduct}`);
        }
    }, []);

    // Main analysis function
    const handleAnalysis = useCallback(async () => {
        setError(null);
        setAdvice(null);
        setCalculations(null);
        setChartData([]);

        const { capitale, durataMesi } = inputs;
        const loanAmountNum = parseFloat(capitale);
        const durationNum = parseInt(durataMesi);
        
        // Enhanced validation
        if (isNaN(loanAmountNum) || loanAmountNum <= 0 || loanAmountNum > 10000000) {
            setError("Inserisci un importo valido compreso tra 1€ e 10.000.000€.");
            return;
        }
        
        if (isNaN(durationNum) || durationNum <= 0 || durationNum > 600) {
            setError("Inserisci una durata valida compresa tra 1 e 600 mesi.");
            return;
        }

        // Validate required fields based on product type
        if (product === 'Prestito' && (!inputs.tan || parseFloat(inputs.tan) <= 0)) {
            setError("Inserisci un TAN valido per il prestito.");
            return;
        }
        
        if (product === 'Mutuo' && (!inputs.spread || !inputs.parametroRiferimento)) {
            setError("Inserisci spread e parametro di riferimento validi per il mutuo.");
            return;
        }
        
        setIsLoading(true);

        try {
            // Calculate loan details
            const loanCalc = calculateLoan(product, inputs);
            setCalculations(loanCalc);

            // Get AI advice
            const aiAdvice = await getFinancialAdvice(inputs, product, loanCalc);
            setAdvice(aiAdvice);

            // Generate chart data
            const loanAmount = parseFloat(capitale);
            const loanCost = loanCalc.costoFinale;
            const investmentGain = aiAdvice.projectedInvestmentGrowth;

            const chartDataResult: ChartData[] = [
                {
                    name: 'Opzioni Finanziarie',
                    'Costo Finale Totale': loanCost,
                    'Guadagno da Investimento': Math.max(0, investmentGain)
                }
            ];
            setChartData(chartDataResult);

        } catch (error) {
            console.error('Errore durante l\'analisi:', error);
            setError(error instanceof Error ? error.message : 'Si è verificato un errore durante l\'analisi. Riprova.');
        } finally {
            setIsLoading(false);
        }
    }, [inputs, product, calculateLoan]);

    return {
        // State
        product,
        inputs,
        calculations,
        advice,
        chartData,
        isLoading,
        error,
        
        // Actions
        handleInputChange,
        handlePortfolioChange,
        addPortfolioItem,
        removePortfolioItem,
        handleProductChange,
        handleAnalysis
    };
};
