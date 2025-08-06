
import React from 'react';
import { AllLoanInputs, FinancialProduct, PortfolioItem } from '../types';
import { SparklesIcon } from './icons';
import ProductSelector from './loan/ProductSelector';
import FinancialDetails from './loan/FinancialDetails';
import PortfolioSection from './loan/PortfolioSection';

interface LoanFormProps {
  inputs: AllLoanInputs;
  product: FinancialProduct;
  onProductChange: (product: FinancialProduct) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPortfolioChange: (id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => void;
  onAddPortfolioItem: () => void;
  onRemovePortfolioItem: (id: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const LoanForm: React.FC<LoanFormProps> = React.memo(({ 
  inputs, 
  product, 
  onProductChange, 
  onInputChange, 
  onPortfolioChange, 
  onAddPortfolioItem, 
  onRemovePortfolioItem, 
  onAnalyze, 
  isLoading 
}) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <ProductSelector product={product} onProductChange={onProductChange} />
      
      <form onSubmit={(e) => { e.preventDefault(); onAnalyze(); }} className="space-y-4">
        <FinancialDetails 
          product={product} 
          inputs={inputs} 
          onInputChange={onInputChange} 
        />
        
        <PortfolioSection
          inputs={inputs}
          onInputChange={onInputChange}
          onPortfolioChange={onPortfolioChange}
          onAddPortfolioItem={onAddPortfolioItem}
          onRemovePortfolioItem={onRemovePortfolioItem}
        />
        
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold text-lg py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisi in corso...
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                Analizza la Strategia
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

export default LoanForm;
