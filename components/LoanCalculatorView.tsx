import React from 'react';
import LoanForm from './LoanForm';
import ResultsDisplay from './ResultsDisplay';
import RecommendationCard from './RecommendationCard';
import ComparisonChart from './ComparisonChart';
import { LogoIcon } from './icons';
import { useLoanCalculator } from '../hooks/useLoanCalculator';

interface LoanCalculatorViewProps {
    onBack?: () => void;
}

const LoanCalculatorView: React.FC<LoanCalculatorViewProps> = ({ onBack }) => {
    const {
        product,
        inputs,
        calculations,
        advice,
        chartData,
        isLoading,
        error,
        handleInputChange,
        handlePortfolioChange,
        addPortfolioItem,
        removePortfolioItem,
        handleProductChange,
        handleAnalysis
    } = useLoanCalculator();

    return (
        <div className="min-h-screen flex flex-col pt-20">
            {/* Header Section */}
            <section className="section-sm">
                <div className="container">
                    <header className="flex items-center gap-4 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <LogoIcon className="w-14 h-14 text-cyan-400" />
                            <div>
                                <h1 className="heading-h1 text-white">Consulente Finanziario AI</h1>
                                <p className="body text-slate-400 mt-1">Analisi intelligenti per le tue decisioni finanziarie</p>
                            </div>
                        </div>
                    </header>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="section flex-1">
                <div className="container">
                    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                        <div className="lg:col-span-1">
                            <LoanForm
                                inputs={inputs}
                                product={product}
                                onProductChange={handleProductChange}
                                onInputChange={handleInputChange}
                                onPortfolioChange={handlePortfolioChange}
                                onAddPortfolioItem={addPortfolioItem}
                                onRemovePortfolioItem={removePortfolioItem}
                                onAnalyze={handleAnalysis}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl">
                                    <p className="heading-h3 text-lg">Errore di Analisi</p>
                                    <p className="body">{error}</p>
                                </div>
                            )}
                            {isLoading && !calculations && (
                                <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="animate-spin w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="heading-h2 text-white">Analisi in corso...</span>
                                    </div>
                                    <p className="body mt-2 max-w-sm text-slate-400">
                                        L'IA sta elaborando la tua richiesta e calcolando la strategia ottimale.
                                    </p>
                                </div>
                            )}
                            {calculations && !isLoading && (
                                <>
                                    <ResultsDisplay calculations={calculations} product={product} inputs={inputs} />
                                    <RecommendationCard advice={advice} isLoading={isLoading} />
                                    {chartData.length > 0 && (
                                        <ComparisonChart data={chartData} />
                                    )}
                                </>
                            )}
                            {!calculations && !isLoading && !error && (
                                <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-dashed border-slate-700">
                                    <LogoIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
                                    <h2 className="heading-h2 text-white">Benvenuto nel Consulente Finanziario</h2>
                                    <p className="body mt-2 max-w-sm text-slate-400">
                                        Inserisci i dettagli del finanziamento nel modulo a sinistra e clicca "Analizza la Strategia" per iniziare.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
};

export default React.memo(LoanCalculatorView);
