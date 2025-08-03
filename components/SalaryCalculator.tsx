import React, { useState } from 'react';
import { SalaryCalculatorInputs, ContractType, SalaryCalculationResults } from '../types';
import { calculateNetSalary } from '../services/salaryService';
import { WalletIcon, HomeIcon, SparklesIcon } from './icons';
import SalaryResults from './SalaryResults';
import Footer from './Footer';

const initialSalaryInputs: SalaryCalculatorInputs = {
    ral: '30000',
    mensilita: '13',
    regione: 'Lombardia',
    addizionaleComunale: '0.8',
    contractType: 'indeterminato',
    figliACarico: '0',
    altriFamiliariACarico: '0',
};

// Simplified list of Italian regions
const regioni = [
    "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", 
    "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", 
    "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", 
    "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];

interface SalaryCalculatorProps {
  onBack: () => void;
  onNavigateToLoanCalculator?: () => void;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ onBack, onNavigateToLoanCalculator }) => {
    const [inputs, setInputs] = useState<SalaryCalculatorInputs>(initialSalaryInputs);
    const [results, setResults] = useState<SalaryCalculationResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResults(null);
        setIsLoading(true);

        // Basic validation
        if (parseFloat(inputs.ral) <= 0) {
            setError("La Retribuzione Annua Lorda (RAL) deve essere un valore positivo.");
            setIsLoading(false);
            return;
        }

        try {
            const calculatedResults = calculateNetSalary(inputs);
            setResults(calculatedResults);
        } catch (err) {
            setError("Si è verificato un errore durante il calcolo. Riprova.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col pt-20">
            {/* Header Section */}
            <section className="section-sm">
                <div className="container">
                    <header className="flex items-center gap-4 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <WalletIcon className="w-14 h-14 text-cyan-400" />
                            <div>
                                <h1 className="heading-h1 text-white">Calcolatore Stipendio Netto</h1>
                                <p className="body text-slate-400 mt-1">Dal Lordo al Netto con le regole 2025</p>
                            </div>
                        </div>
                    </header>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="section flex-1">
                <div className="container">
                    <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-slide-up">
                        <div className="lg:col-span-2">
                            <form onSubmit={handleCalculate} className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80 space-y-5">
                                <h2 className="heading-h2 text-white">I Tuoi Dati</h2>
                                
                                <div>
                                    <label htmlFor="ral" className="body-sm block font-medium text-slate-300 mb-1.5">Retribuzione Annua Lorda (RAL)</label>
                                    <div className="relative">
                                        <input type="number" id="ral" name="ral" value={inputs.ral} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">€</span>
                                    </div>
                                </div>

                                 <div>
                                    <label htmlFor="mensilita" className="body-sm block font-medium text-slate-300 mb-1.5">Numero Mensilità</label>
                                    <select id="mensilita" name="mensilita" value={inputs.mensilita} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                    </select>
                                </div>

                                 <div>
                                    <label htmlFor="contractType" className="body-sm block font-medium text-slate-300 mb-1.5">Tipo di Contratto</label>
                                    <select id="contractType" name="contractType" value={inputs.contractType} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        <option value="indeterminato">Tempo Indeterminato</option>
                                        <option value="determinato">Tempo Determinato</option>
                                        <option value="apprendistato">Apprendistato</option>
                                    </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="regione" className="body-sm block font-medium text-slate-300 mb-1.5">Regione Residenza</label>
                                        <select id="regione" name="regione" value={inputs.regione} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                            </select>
                                    </div>
                                    <div>
                                        <label htmlFor="addizionaleComunale" className="body-sm block font-medium text-slate-300 mb-1.5">Add. Comunale</label>
                                        <div className="relative">
                                        <input type="number" step="0.1" id="addizionaleComunale" name="addizionaleComunale" value={inputs.addizionaleComunale} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                         <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">%</span>
                                        </div>
                                    </div>
                                </div>

                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="figliACarico" className="body-sm block font-medium text-slate-300 mb-1.5">Figli a Carico (&lt;21)</label>
                                        <input type="number" id="figliACarico" name="figliACarico" min="0" value={inputs.figliACarico} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                    </div>
                                    <div>
                                         <label htmlFor="altriFamiliariACarico" className="body-sm block font-medium text-slate-300 mb-1.5">Altri Familiari</label>
                                         <input type="number" id="altriFamiliariACarico" name="altriFamiliariACarico" min="0" value={inputs.altriFamiliariACarico} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold text-lg py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none transition-all duration-300 ease-in-out">
                                        {isLoading ? 'Calcolo...' : 'Calcola Netto Mensile'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-3">
                            {error && <div className="text-red-400 bg-red-900/30 p-4 rounded-lg body">{error}</div>}
                            
                            {results ? (
                               <SalaryResults results={results} />
                            ) : (
                               <div className="flex flex-col justify-center items-center h-full min-h-[400px] bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-dashed border-slate-700">
                                    <SparklesIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
                                    <h2 className="heading-h2 text-white">Il tuo stipendio, in chiaro</h2>
                                    <p className="body mt-2 max-w-sm text-slate-400">Inserisci i dati nel modulo per scoprire il tuo stipendio netto mensile e annuale.</p>
                               </div>
                            )}
                        </div>
                    </main>
                </div>
            </section>

            {/* Footer */}
            <Footer 
                onNavigateToLoanCalculator={onNavigateToLoanCalculator}
                onNavigateToSalaryCalculator={() => {/* Already on salary calculator */}}
                onNavigateToHome={onBack}
            />
        </div>
    );
};

export default SalaryCalculator;