import React, { useMemo } from 'react';
import { LogoIcon, CalculatorIcon, WalletIcon, HomeIcon, TrendingUpIcon } from './icons';

interface NavBarProps {
    currentView: 'home' | 'loanCalculator' | 'salaryCalculator' | 'investmentAnalysis';
    onNavigateToHome: () => void;
    onNavigateToLoanCalculator: () => void;
    onNavigateToSalaryCalculator: () => void;
    onNavigateToInvestmentAnalysis: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
    currentView, 
    onNavigateToHome, 
    onNavigateToLoanCalculator, 
    onNavigateToSalaryCalculator,
    onNavigateToInvestmentAnalysis
}) => {
    const navItems = useMemo(() => [
        {
            id: 'loanCalculator' as const,
            label: 'Consulente Finanziario',
            icon: CalculatorIcon,
            onClick: onNavigateToLoanCalculator
        },
        {
            id: 'salaryCalculator' as const,
            label: 'Calcolatore Stipendio',
            icon: WalletIcon,
            onClick: onNavigateToSalaryCalculator
        },
        {
            id: 'investmentAnalysis' as const,
            label: 'Analisi Investimenti',
            icon: TrendingUpIcon,
            onClick: onNavigateToInvestmentAnalysis
        }
    ], [onNavigateToLoanCalculator, onNavigateToSalaryCalculator, onNavigateToInvestmentAnalysis]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
            <div className="container">
                <div className="flex items-center py-4">
                    {/* Logo/Brand - Left side */}
                    <button
                        onClick={onNavigateToHome}
                        className="flex items-center gap-3 group transition-all duration-200 hover:scale-105"
                    >
                        <LogoIcon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        <span className="heading-h3 text-white text-xl group-hover:text-cyan-100 transition-colors">
                            Smart Advisor
                        </span>
                    </button>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Navigation Items - Right side */}
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        {/* Home Button */}
                        <button
                            onClick={onNavigateToHome}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                                currentView === 'home'
                                    ? 'bg-cyan-500 text-white shadow-cyan-500/20 shadow-lg'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                            }`}
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span className="body hidden lg:inline">Home</span>
                        </button>

                        {/* Navigation Items */}
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={item.onClick}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                                    currentView === item.id
                                        ? 'bg-cyan-500 text-white shadow-cyan-500/20 shadow-lg'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="body hidden lg:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default React.memo(NavBar);
