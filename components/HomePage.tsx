
import React from 'react';
import { LogoIcon, CalculatorIcon, WalletIcon } from './icons';
import Footer from './Footer';

interface HomePageProps {
    onNavigateToLoanCalculator: () => void;
    onNavigateToSalaryCalculator: () => void;
}

const ToolCard: React.FC<{
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/70 hover:bg-slate-800 transition-all duration-300 text-left w-full h-full flex flex-col transform hover:-translate-y-1 animate-slide-up"
    >
        <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-lg">
                <Icon className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="heading-h3 text-white text-2xl">
                {title}
            </h3>
        </div>
        <p className="body mt-4 text-slate-400 leading-relaxed flex-grow">
            {description}
        </p>
        <div className="mt-6 text-cyan-400 font-semibold flex items-center gap-2">
            <span className="body">Utilizza Strumento</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
        </div>
    </button>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLoanCalculator, onNavigateToSalaryCalculator }) => {
    return (
        <div className="min-h-screen flex flex-col pt-20">
            {/* Hero Section */}
            <section className="section-lg flex items-center justify-center">
                <div className="container">
                    <div className="text-center animate-fade-in">
                        <LogoIcon className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
                        <h1 className="heading-display text-white tracking-tight mb-6">
                            La Tua <span className="text-cyan-400">Suite Finanziaria</span> Personale
                        </h1>
                        <p className="body-lg max-w-3xl mx-auto text-slate-300 leading-8">
                            Strumenti intelligenti per navigare le tue decisioni finanziarie. Analizza prestiti, calcola il tuo stipendio netto e pianifica con sicurezza.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <ToolCard
                            icon={CalculatorIcon}
                            title="Consulente Finanziario"
                            description="Analizza prestiti, mutui e finanziamenti. Lascia che l'IA ti consigli se conviene usare i tuoi risparmi o richiedere un finanziamento."
                            onClick={onNavigateToLoanCalculator}
                        />
                        <ToolCard
                            icon={WalletIcon}
                            title="Calcolatore Stipendio Netto"
                            description="Calcola il tuo stipendio netto mensile partendo dalla Retribuzione Annua Lorda (RAL), aggiornato con le normative fiscali italiane 2025."
                            onClick={onNavigateToSalaryCalculator}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer 
                onNavigateToLoanCalculator={onNavigateToLoanCalculator}
                onNavigateToSalaryCalculator={onNavigateToSalaryCalculator}
            />
        </div>
    );
};

export default HomePage;
