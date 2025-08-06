import React from 'react';
import { AllLoanInputs, PortfolioItem } from '../../types';
import { PlusCircleIcon, TrashIcon } from '../icons';
import InputField from './InputField';

interface PortfolioSectionProps {
  inputs: AllLoanInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPortfolioChange: (id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => void;
  onAddPortfolioItem: () => void;
  onRemovePortfolioItem: (id: string) => void;
}

const fieldTooltips = {
  liquidSavings: "I tuoi risparmi immediatamente disponibili in conti correnti o depositi. Non include investimenti che richiedono vendita."
};

const portfolioTooltips = {
  name: "Il nome dell'investimento o strumento finanziario (es. ETF, azioni, obbligazioni, fondi comuni).",
  amount: "L'importo attualmente investito in questo strumento. Usa il valore di mercato corrente, non quello di acquisto.",
  returnRate: "Il rendimento annuo atteso o storico di questo investimento. Considera rendimenti realistici basati su dati storici."
};

// Info tooltip component
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="group relative inline-block align-middle ml-2">
    <svg className="w-4 h-4 text-cyan-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">i</text>
    </svg>
    <span className="absolute left-1/2 -translate-x-1/2 -top-9 z-20 hidden group-hover:block bg-slate-900 text-slate-200 text-xs rounded-md px-2 py-1 shadow-lg border border-slate-700 w-max max-w-[220px] whitespace-pre-line text-center leading-tight">
      {text}
    </span>
  </span>
);

const PortfolioTooltip: React.FC<{ type: keyof typeof portfolioTooltips; children: React.ReactNode }> = ({ type, children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      <InfoTooltip text={portfolioTooltips[type]} />
    </div>
  );
};

const PortfolioSection: React.FC<PortfolioSectionProps> = React.memo(({ 
  inputs, 
  onInputChange, 
  onPortfolioChange, 
  onAddPortfolioItem, 
  onRemovePortfolioItem 
}) => {
  return (
    <div>
      <div className="h-px bg-slate-700 my-6"></div>
      
      <h3 className="text-xl font-bold text-white mb-4 -mt-1">La Tua Situazione</h3>
      <div className="space-y-4">
        <InputField 
          label="Risparmi Liquidi (non investiti)" 
          name="liquidSavings" 
          value={inputs.liquidSavings} 
          onChange={onInputChange} 
          adornment="€" 
          placeholder="es. 5000" 
          tooltip={fieldTooltips.liquidSavings}
        />
        
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Portafoglio Investimenti</h4>
          <div className="space-y-4">
            {inputs.portfolio.map((item) => (
              <div key={item.id} className="bg-slate-900/40 p-4 rounded-lg border border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <PortfolioTooltip type="name">
                    <label htmlFor={`name-${item.id}`} className="block text-sm font-medium text-slate-300">Voce Portafoglio</label>
                  </PortfolioTooltip>
                  <button 
                    type="button" 
                    onClick={() => onRemovePortfolioItem(item.id)} 
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <input
                  id={`name-${item.id}`}
                  value={item.name}
                  onChange={(e) => onPortfolioChange(item.id, 'name', e.target.value)}
                  placeholder="es. Azioni ETF"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <PortfolioTooltip type="amount">
                      <label htmlFor={`amount-${item.id}`} className="block text-xs font-medium text-slate-400 mb-1">Importo</label>
                    </PortfolioTooltip>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id={`amount-${item.id}`}
                        value={item.amount}
                        onChange={(e) => onPortfolioChange(item.id, 'amount', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="es. 10000"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">€</span>
                    </div>
                  </div>
                  <div>
                    <PortfolioTooltip type="returnRate">
                      <label htmlFor={`return-${item.id}`} className="block text-xs font-medium text-slate-400 mb-1">Rendimento</label>
                    </PortfolioTooltip>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id={`return-${item.id}`}
                        value={item.returnRate}
                        onChange={(e) => onPortfolioChange(item.id, 'returnRate', e.target.value)}
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
              onClick={onAddPortfolioItem}
              className="w-full flex items-center justify-center gap-2 text-cyan-400 font-medium py-2.5 px-4 rounded-lg border-2 border-dashed border-slate-600 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Aggiungi Voce al Portafoglio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PortfolioSection.displayName = 'PortfolioSection';

export default PortfolioSection;
