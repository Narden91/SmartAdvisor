import React, { useState, useCallback } from 'react';
import { TrendingUpIcon } from './icons';
import { PortfolioItem } from '../types';
import { sanitizeInput, validateNumericInput } from '../security.config';
import InvestmentForm from './investment/InvestmentForm';
import PortfolioManager from './investment/PortfolioManager';
import InvestmentResults from './investment/InvestmentResults';

interface InvestmentAnalysisProps {
    // We can extend this later with additional props if needed
}

interface InvestmentInput {
    investmentAmount: string;
    timeHorizonYears: string;
    riskTolerance: 'low' | 'medium' | 'high';
}

interface InvestmentResult {
    projectedValue: number;
    totalReturn: number;
    annualizedReturn: number;
    inflationAdjustedValue: number;
}

const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = React.memo(() => {
    const [inputs, setInputs] = useState<InvestmentInput>({
        investmentAmount: '10000',
        timeHorizonYears: '10',
        riskTolerance: 'medium'
    });

    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

    const [results, setResults] = useState<InvestmentResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const sanitizeNumericInput = useCallback((value: string): string => {
        return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (e.target.type === 'text' && (name === 'investmentAmount' || name === 'timeHorizonYears')) {
            const sanitized = sanitizeNumericInput(value);
            // Validate specific constraints
            if (name === 'investmentAmount' && !validateNumericInput(sanitized, 1, 10000000)) {
                return; // Skip update for invalid investment amount
            }
            if (name === 'timeHorizonYears' && !validateNumericInput(sanitized, 1, 100)) {
                return; // Skip update for invalid time horizon
            }
            setInputs(prev => ({ ...prev, [name]: sanitized }));
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    }, [sanitizeNumericInput]);

    const handlePortfolioChange = useCallback((id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => {
        setPortfolio(prev =>
            prev.map(item => {
                if (item.id === id) {
                    let sanitizedValue = value;
                    
                    // Sanitize based on field type
                    if (field === 'amount' || field === 'returnRate') {
                        sanitizedValue = sanitizeNumericInput(value);
                        // Validate numeric constraints
                        if (field === 'amount' && !validateNumericInput(sanitizedValue, 0, 100)) {
                            return item; // Keep previous value if invalid (percentage allocation)
                        }
                        if (field === 'returnRate' && !validateNumericInput(sanitizedValue, -100, 100)) {
                            return item; // Keep previous value if invalid
                        }
                    } else if (field === 'name') {
                        // Use centralized security utility
                        sanitizedValue = sanitizeInput(value);
                    }
                    
                    return { ...item, [field]: sanitizedValue };
                }
                return item;
            })
        );
    }, [sanitizeNumericInput]);

    const addPortfolioItem = useCallback(() => {
        const defaultAssets = [
            'Azioni ETF Mondo (VWCE)',
            'Obbligazioni Governative',
            'Conto Deposito',
            'Immobiliare (REIT)',
            'Azioni Europa',
            'Azioni USA',
            'Materie Prime',
            'Crypto (Bitcoin)',
            'Obbligazioni Corporate'
        ];
        
        const placeholder = defaultAssets[portfolio.length % defaultAssets.length] || 'Nuovo Asset';
        
        setPortfolio(prev => [
            ...prev,
            { 
                id: Date.now().toString(), 
                name: '', 
                amount: '', 
                returnRate: '' 
            }
        ]);
    }, [portfolio.length]);

    const removePortfolioItem = useCallback((id: string) => {
        setPortfolio(prev => prev.filter(item => item.id !== id));
    }, []);

    const calculateInvestment = useCallback(() => {
        setIsLoading(true);
        
        try {
            const amount = parseFloat(inputs.investmentAmount) || 0;
            const years = parseFloat(inputs.timeHorizonYears) || 0;
            
            // Enhanced validation
            if (amount <= 0 || amount > 10000000) {
                throw new Error("L'importo da investire deve essere compreso tra 1€ e 10.000.000€.");
            }
            
            if (years <= 0 || years > 100) {
                throw new Error("L'orizzonte temporale deve essere compreso tra 1 e 100 anni.");
            }
            
            // Handle empty portfolio with default conservative return
            let weightedReturn = 0;
            
            if (portfolio.length === 0) {
                // Default conservative return for empty portfolio (3% annual)
                weightedReturn = 3;
            } else {
                // Validate portfolio allocation
                const totalWeight = portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                if (Math.abs(totalWeight - 100) > 0.01) {
                    throw new Error("L'allocazione del portafoglio deve sommare al 100%.");
                }
                
                // Calculate weighted average return
                weightedReturn = portfolio.reduce((sum, item) => {
                    const weight = (parseFloat(item.amount) || 0) / totalWeight;
                    const rate = parseFloat(item.returnRate) || 0;
                    return sum + (weight * rate);
                }, 0);
            }

            // Apply compound growth
            const futureValue = amount * Math.pow(1 + weightedReturn / 100, years);
            const totalReturn = futureValue - amount;
            const annualizedReturn = Math.pow(futureValue / amount, 1 / years) - 1;
            
            // Inflation adjustment (3% annual inflation)
            const inflationRate = 0.03;
            const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate, years);

            setResults({
                projectedValue: futureValue,
                totalReturn: totalReturn,
                annualizedReturn: annualizedReturn * 100,
                inflationAdjustedValue: inflationAdjustedValue
            });
        } catch (error) {
            // Handle calculation errors
            const errorMessage = error instanceof Error ? error.message : "Si è verificato un errore durante il calcolo.";
            alert(errorMessage); // Replace with proper error state management if needed
        } finally {
            setIsLoading(false);
        }
    }, [inputs, portfolio]);

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        calculateInvestment();
    }, [calculateInvestment]);

    return (
        <div className="min-h-screen flex flex-col pt-20">
            {/* Header Section */}
            <section className="section-sm">
                <div className="container">
                    <header className="flex items-center gap-4 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <TrendingUpIcon className="w-14 h-14 text-cyan-400" />
                            <div>
                                <h1 className="heading-h1 text-white">Analisi Investimenti</h1>
                                <p className="body text-slate-400 mt-1">Simula la crescita del tuo portafoglio nel tempo</p>
                            </div>
                        </div>
                    </header>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="section flex-1">
                <div className="container">
                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                        {/* Input Form - Scrollable when needed */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                <InvestmentForm
                                    investmentAmount={inputs.investmentAmount}
                                    timeHorizonYears={inputs.timeHorizonYears}
                                    riskTolerance={inputs.riskTolerance}
                                    onInputChange={handleInputChange}
                                    onSubmit={handleFormSubmit}
                                    isLoading={isLoading}
                                />
                                
                                <PortfolioManager
                                    portfolio={portfolio}
                                    onPortfolioChange={handlePortfolioChange}
                                    onAddPortfolioItem={addPortfolioItem}
                                    onRemovePortfolioItem={removePortfolioItem}
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-2">
                            {results ? (
                                <InvestmentResults 
                                    results={results} 
                                    timeHorizon={inputs.timeHorizonYears} 
                                />
                            ) : (
                                <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-dashed border-slate-700">
                                    <TrendingUpIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
                                    <h2 className="heading-h2 text-white">Analizza il Tuo Investimento</h2>
                                    <p className="body mt-2 max-w-sm text-slate-400">
                                        Inserisci i parametri del tuo investimento e clicca "Analizza" per vedere le proiezioni di crescita.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
});

export default InvestmentAnalysis;
