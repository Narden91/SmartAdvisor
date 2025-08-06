import React, { useState, useCallback } from 'react';
import { TrendingUpIcon, PlusCircleIcon, TrashIcon, ChartBarIcon } from './icons';
import { PortfolioItem } from '../types';
import { sanitizeInput, validateNumericInput } from '../security.config';

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

    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
        { id: '1', name: 'Azioni ETF Mondo (VWCE)', amount: '40', returnRate: '8' },
        { id: '2', name: 'Obbligazioni Governative', amount: '30', returnRate: '3.5' },
        { id: '3', name: 'Conto Deposito', amount: '20', returnRate: '3' },
        { id: '4', name: 'Immobiliare (REIT)', amount: '10', returnRate: '6' }
    ]);

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
        setPortfolio(prev => [
            ...prev,
            { id: Date.now().toString(), name: '', amount: '0', returnRate: '0' }
        ]);
    }, []);

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
            
            // Validate portfolio allocation
            const totalWeight = portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
            if (Math.abs(totalWeight - 100) > 0.01) {
                throw new Error("L'allocazione del portafoglio deve sommare al 100%.");
            }
            
            // Calculate weighted average return
            const weightedReturn = portfolio.reduce((sum, item) => {
                const weight = (parseFloat(item.amount) || 0) / totalWeight;
                const rate = parseFloat(item.returnRate) || 0;
                return sum + (weight * rate);
            }, 0);

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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatPercent = (value: number) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    const InputField: React.FC<{
        label: string;
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        adornment?: string;
        placeholder?: string;
    }> = ({ label, name, value, onChange, adornment, placeholder }) => (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-slate-300">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder={placeholder || (adornment === '€' ? 'es. 10000' : 'es. 10')}
                />
                {adornment && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                        {adornment}
                    </span>
                )}
            </div>
        </div>
    );

    const ResultBox: React.FC<{ label: string; value: string; subtitle?: string; isPositive?: boolean }> = ({ 
        label, 
        value, 
        subtitle, 
        isPositive = true 
    }) => (
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {value}
            </p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
    );

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
                        {/* Input Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
                                <h2 className="text-xl font-bold text-white mb-2">Parametri di Analisi</h2>
                                <p className="text-slate-400 mb-4">Configura i tuoi parametri di investimento.</p>
                                
                                <form onSubmit={(e) => { e.preventDefault(); calculateInvestment(); }} className="space-y-4">
                                    <InputField
                                        label="Importo da Investire"
                                        name="investmentAmount"
                                        value={inputs.investmentAmount}
                                        onChange={handleInputChange}
                                        adornment="€"
                                        placeholder="es. 10000"
                                    />
                                    
                                    <InputField
                                        label="Orizzonte Temporale"
                                        name="timeHorizonYears"
                                        value={inputs.timeHorizonYears}
                                        onChange={handleInputChange}
                                        adornment="anni"
                                        placeholder="es. 10"
                                    />

                                    <div className="space-y-2">
                                        <label htmlFor="riskTolerance" className="block text-sm font-medium text-slate-300">
                                            Tolleranza al Rischio
                                        </label>
                                        <select
                                            id="riskTolerance"
                                            name="riskTolerance"
                                            value={inputs.riskTolerance}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                        >
                                            <option value="low">Conservativa (Basso Rischio)</option>
                                            <option value="medium">Moderata (Rischio Medio)</option>
                                            <option value="high">Aggressiva (Alto Rischio)</option>
                                        </select>
                                    </div>

                                    <div className="h-px bg-slate-700 my-6"></div>

                                    <h3 className="text-lg font-bold text-white mb-4">Allocazione Portafoglio</h3>
                                    <div className="space-y-4">
                                        {portfolio.map((item) => (
                                            <div key={item.id} className="bg-slate-900/40 p-4 rounded-lg border border-slate-700 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-slate-300">Asset</label>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removePortfolioItem(item.id)} 
                                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <input
                                                    value={item.name}
                                                    onChange={(e) => handlePortfolioChange(item.id, 'name', e.target.value)}
                                                    placeholder="es. Azioni ETF"
                                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-1">Allocazione %</label>
                                                        <div className="relative">
                                                            <input
                                                                value={item.amount}
                                                                onChange={(e) => handlePortfolioChange(item.id, 'amount', e.target.value)}
                                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                                placeholder="es. 40"
                                                            />
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-400 mb-1">Rendimento Annuo</label>
                                                        <div className="relative">
                                                            <input
                                                                value={item.returnRate}
                                                                onChange={(e) => handlePortfolioChange(item.id, 'returnRate', e.target.value)}
                                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                                placeholder="es. 8"
                                                            />
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addPortfolioItem}
                                            className="w-full flex items-center justify-center gap-2 text-cyan-400 font-medium py-2.5 px-4 rounded-lg border-2 border-dashed border-slate-600 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-colors"
                                        >
                                            <PlusCircleIcon className="w-5 h-5" />
                                            Aggiungi Asset
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                Calcolando...
                                            </>
                                        ) : (
                                            <>
                                                <ChartBarIcon className="w-5 h-5" />
                                                Analizza Investimento
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-2 space-y-8">
                            {results ? (
                                <>
                                    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
                                        <div className="flex items-center gap-3 mb-6">
                                            <TrendingUpIcon className="w-7 h-7 text-cyan-400" />
                                            <h2 className="text-xl font-bold text-white">Proiezione di Crescita</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <ResultBox
                                                label="Valore Futuro Stimato"
                                                value={formatCurrency(results.projectedValue)}
                                                subtitle={`In ${inputs.timeHorizonYears} anni`}
                                            />
                                            <ResultBox
                                                label="Rendimento Totale"
                                                value={formatCurrency(results.totalReturn)}
                                                subtitle="Guadagno assoluto"
                                            />
                                            <ResultBox
                                                label="Rendimento Annualizzato"
                                                value={formatPercent(results.annualizedReturn)}
                                                subtitle="Tasso di crescita medio"
                                            />
                                            <ResultBox
                                                label="Valore Reale (Anti-Inflazione)"
                                                value={formatCurrency(results.inflationAdjustedValue)}
                                                subtitle="Potere d'acquisto futuro"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
                                        <h3 className="text-lg font-bold text-white mb-4">Considerazioni Importanti</h3>
                                        <div className="space-y-3 text-slate-300">
                                            <p className="body-sm">
                                                <strong className="text-white">📈 Crescita Composta:</strong> I rendimenti mostrati assumono la reinvestimento automatico di tutti i profitti, sfruttando il potere dell'interesse composto.
                                            </p>
                                            <p className="body-sm">
                                                <strong className="text-white">💰 Inflazione:</strong> Il valore reale tiene conto di un'inflazione media del 3% annuo, mostrando il tuo potere d'acquisto futuro.
                                            </p>
                                            <p className="body-sm">
                                                <strong className="text-white">⚠️ Rischi:</strong> Tutti gli investimenti comportano rischi. I rendimenti passati non garantiscono risultati futuri.
                                            </p>
                                            <p className="body-sm">
                                                <strong className="text-white">🎯 Diversificazione:</strong> Un portafoglio diversificato può ridurre il rischio complessivo mantenendo potenziali rendimenti.
                                            </p>
                                        </div>
                                    </div>
                                </>
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
