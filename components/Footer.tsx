import React from 'react';
import { LogoIcon } from './icons';

interface FooterProps {
    onNavigateToLoanCalculator?: () => void;
    onNavigateToSalaryCalculator?: () => void;
    onNavigateToHome?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
    onNavigateToLoanCalculator, 
    onNavigateToSalaryCalculator, 
    onNavigateToHome 
}) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="section bg-slate-900/80 border-t border-slate-700/50">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <LogoIcon className="w-8 h-8 text-cyan-400" />
                            <span className="heading-h3 text-white text-xl">Smart Advisor</span>
                        </div>
                        <p className="body text-slate-300 max-w-xs">
                            La tua suite finanziaria personale per decisioni intelligenti e pianificazione sicura.
                        </p>
                    </div>

                    {/* Tools Section */}
                    <div className="space-y-4">
                        <h4 className="heading-h3 text-white text-lg">Strumenti</h4>
                        <ul className="space-y-2">
                            <li>
                                <button 
                                    onClick={onNavigateToLoanCalculator}
                                    className="body text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer text-left"
                                >
                                    Consulente Finanziario
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={onNavigateToSalaryCalculator}
                                    className="body text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer text-left"
                                >
                                    Calcolatore Stipendio
                                </button>
                            </li>
                            <li>
                                <span className="body text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer">
                                    Analisi Investimenti
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-4">
                        <h4 className="heading-h3 text-white text-lg">Privacy & Cookie</h4>
                        <div className="space-y-3 text-slate-300">
                            <p className="body-sm">
                                <strong className="text-white">Privacy:</strong> I tuoi dati vengono elaborati localmente. 
                                Non raccogliamo informazioni personali sensibili.
                            </p>
                            <p className="body-sm">
                                <strong className="text-white">Cookie:</strong> Utilizziamo solo cookie essenziali per 
                                il funzionamento del sito e cookie analitici per migliorare l'esperienza utente.
                            </p>
                            <p className="body-sm">
                                <strong className="text-white">Normative:</strong> Conforme alle regolamentazioni 
                                finanziarie italiane vigenti per il 2025.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="body-sm text-slate-400">
                            © {currentYear} Smart Advisor. Tutti i diritti riservati.
                        </p>
                        <p className="body-sm text-slate-400">
                            Fatto con ❤️ per le tue finanze
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
