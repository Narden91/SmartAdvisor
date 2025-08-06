import React from 'react';
import { useNavigation } from './hooks/useNavigation';
import LoanCalculatorView from './components/LoanCalculatorView';
import HomePage from './components/HomePage';
import SalaryCalculator from './components/SalaryCalculator';
import InvestmentAnalysis from './components/InvestmentAnalysis';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  const {
    currentView,
    goToHome,
    goToLoanCalculator,
    goToSalaryCalculator,
    goToInvestmentAnalysis
  } = useNavigation();

  const renderContent = () => {
    switch(currentView) {
      case 'home':
        return (
          <HomePage 
            onNavigateToLoanCalculator={goToLoanCalculator}
            onNavigateToSalaryCalculator={goToSalaryCalculator}
            onNavigateToInvestmentAnalysis={goToInvestmentAnalysis}
          />
        );
      case 'loanCalculator':
        return <LoanCalculatorView onBack={goToHome} />;
      case 'salaryCalculator':
        return (
          <SalaryCalculator 
            onBack={goToHome}
            onNavigateToLoanCalculator={goToLoanCalculator}
          />
        );
      case 'investmentAnalysis':
        return <InvestmentAnalysis />;
      default:
        return (
          <HomePage 
            onNavigateToLoanCalculator={goToLoanCalculator}
            onNavigateToSalaryCalculator={goToSalaryCalculator}
            onNavigateToInvestmentAnalysis={goToInvestmentAnalysis}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar 
        currentView={currentView}
        onNavigateToHome={goToHome}
        onNavigateToLoanCalculator={goToLoanCalculator}
        onNavigateToSalaryCalculator={goToSalaryCalculator}
        onNavigateToInvestmentAnalysis={goToInvestmentAnalysis}
      />
      
      <main className="relative">
        {renderContent()}
      </main>
      
      <Footer 
        onNavigateToHome={goToHome}
        onNavigateToLoanCalculator={goToLoanCalculator}
        onNavigateToSalaryCalculator={goToSalaryCalculator}
        onNavigateToInvestmentAnalysis={goToInvestmentAnalysis}
      />
      
      <CookieBanner />
    </div>
  );
};

export default App;
