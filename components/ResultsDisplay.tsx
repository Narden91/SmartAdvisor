
import React from 'react';
import { LoanCalculations, FinancialProduct, PrestitoCalculations, FinanziariaCalculations, MutuoCalculations, AllLoanInputs } from '../types';
import { CalculatorIcon } from './icons';

interface ResultsDisplayProps {
  calculations: LoanCalculations | null;
  product: FinancialProduct;
  inputs: AllLoanInputs;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
}

const ResultBox: React.FC<{ label: string; value: string; isCost?: boolean; className?: string }> = ({ label, value, isCost, className }) => (
    <div className={`bg-slate-700/40 p-4 rounded-lg text-center ${className}`}>
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-2xl font-semibold mt-1 ${isCost ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ calculations, product, inputs }) => {
  if (!calculations) {
    return null;
  }
  
  const importoRichiesto = parseFloat(inputs.capitale) || 0;
  const costoFinale = calculations.costoFinale;
  const importoTotaleRimborsato = importoRichiesto + costoFinale;

  const renderProductSpecificResults = () => {
    switch(product) {
      case 'Prestito':
        const prestitoCalcs = calculations as PrestitoCalculations;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultBox label="Rata Mensile" value={formatCurrency(prestitoCalcs.rataMensile)} />
            <ResultBox label="Interessi Totali" value={formatCurrency(prestitoCalcs.costoTotaleInteressi)} isCost />
          </div>
        );
      case 'Finanziaria':
        const finanziariaCalcs = calculations as FinanziariaCalculations;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultBox label="Rata Mensile" value={formatCurrency(finanziariaCalcs.rataMensile)} />
              <ResultBox label="Costo Assicurativo" value={formatCurrency(finanziariaCalcs.costoAssicurativoTotale)} isCost />
            </div>
        );
      case 'Mutuo':
        const mutuoCalcs = calculations as MutuoCalculations;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultBox label="TAN Effettivo" value={formatPercent(mutuoCalcs.tanEffettivo)} />
            <ResultBox label="Rata Mensile" value={formatCurrency(mutuoCalcs.rataMensile)} />
            <ResultBox label="Interessi Totali" value={formatCurrency(mutuoCalcs.interessiTotali)} isCost />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <div className="flex items-center gap-3 mb-5">
        <CalculatorIcon className="w-7 h-7 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Riepilogo Calcolo {product}</h2>
      </div>

      <div className="mb-5 border-b border-slate-700 pb-5">
          <h3 className="text-base font-semibold text-slate-300 mb-3 uppercase tracking-wider">Dettagli Chiave Inseriti</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400">Importo Richiesto</p>
                  <p className="text-xl font-semibold mt-1 text-white">{formatCurrency(parseFloat(inputs.capitale) || 0)}</p>
              </div>
              <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400">Durata</p>
                  <p className="text-xl font-semibold mt-1 text-white">{inputs.durataMesi} mesi</p>
              </div>
          </div>
      </div>
      
      {/* Renders the product-specific details */}
      {renderProductSpecificResults()}

      {/* Renders the final totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 border-t border-slate-700 pt-5">
        <ResultBox 
            label="Costo Finale Totale" 
            value={formatCurrency(costoFinale)} 
            isCost 
            className="bg-red-900/20 border border-red-500/30"
        />
        <ResultBox 
            label="Importo Totale da Rimborsare" 
            value={formatCurrency(importoTotaleRimborsato)}
            className="bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-cyan-500 shadow-lg shadow-cyan-900/50"
        />
      </div>
    </div>
  );
};

export default React.memo(ResultsDisplay);