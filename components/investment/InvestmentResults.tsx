import React from 'react';
import { TrendingUpIcon } from '../icons';

interface InvestmentResult {
  projectedValue: number;
  totalReturn: number;
  annualizedReturn: number;
  inflationAdjustedValue: number;
}

interface InvestmentResultsProps {
  results: InvestmentResult;
  timeHorizon: string;
}

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

const ResultBox: React.FC<{ 
  label: string; 
  value: string; 
  subtitle?: string; 
  isPositive?: boolean 
}> = ({ label, value, subtitle, isPositive = true }) => (
  <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700">
    <p className="text-sm text-slate-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
      {value}
    </p>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const InvestmentResults: React.FC<InvestmentResultsProps> = React.memo(({ results, timeHorizon }) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUpIcon className="w-7 h-7 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Proiezione di Crescita</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultBox
          label="Valore Futuro Stimato"
          value={formatCurrency(results.projectedValue)}
          subtitle={`In ${timeHorizon} anni`}
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
          label="Valore Reale (al netto inflazione)"
          value={formatCurrency(results.inflationAdjustedValue)}
          subtitle="Potere d'acquisto futuro"
        />
      </div>
    </div>
  );
});

InvestmentResults.displayName = 'InvestmentResults';

export default InvestmentResults;
