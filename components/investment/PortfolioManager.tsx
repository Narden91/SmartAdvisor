import React from 'react';
import { PortfolioItem } from '../../types';
import { PlusCircleIcon, TrashIcon } from '../icons';

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  onPortfolioChange: (id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => void;
  onAddPortfolioItem: () => void;
  onRemovePortfolioItem: (id: string) => void;
}

const getPlaceholderAsset = (index: number): string => {
  const defaultAssets = [
    'Azioni ETF Mondo (VWCE)',
    'Obbligazioni Governative',
    'Conto Deposito',
    'Immobiliare (REIT)',
    'Azioni Europa',
    'Azioni USA',
    'Materie Prime',
    'Crypto (Bitcoin)',
    'Obbligazioni Corporate'
  ];
  return defaultAssets[index % defaultAssets.length] || 'Nuovo Asset';
};

const PortfolioManager: React.FC<PortfolioManagerProps> = React.memo(({
  portfolio,
  onPortfolioChange,
  onAddPortfolioItem,
  onRemovePortfolioItem
}) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Allocazione Portafoglio</h3>
        {portfolio.length > 0 && (
          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            {portfolio.length} asset{portfolio.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {portfolio.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-slate-400 mb-4">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium text-slate-400 mb-1">Portafoglio vuoto</p>
              <p className="text-xs text-slate-500 mb-4">
                Senza allocazioni specifiche, verrà usato un rendimento conservativo del 3% annuo
              </p>
              
              {/* Placeholder examples */}
              <div className="bg-slate-900/30 rounded-lg p-3 mb-4 text-left">
                <p className="text-xs text-slate-400 mb-2 font-medium">Esempi di allocazione:</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>• Azioni ETF Mondo (VWCE)</span>
                    <span className="text-slate-400">70% | 7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Obbligazioni Governative</span>
                    <span className="text-slate-400">20% | 3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Conto Deposito</span>
                    <span className="text-slate-400">10% | 2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {portfolio.map((item, index) => (
              <div key={item.id} className="bg-slate-900/40 p-3 rounded-lg border border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-300">Asset #{index + 1}</label>
                  <button 
                    type="button" 
                    onClick={() => onRemovePortfolioItem(item.id)} 
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Rimuovi asset"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <input
                  value={item.name}
                  onChange={(e) => onPortfolioChange(item.id, 'name', e.target.value)}
                  placeholder={`es. ${getPlaceholderAsset(index)}`}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Allocazione %</label>
                    <div className="relative">
                      <input
                        value={item.amount}
                        onChange={(e) => onPortfolioChange(item.id, 'amount', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                        placeholder="es. 40"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Rendimento Annuo</label>
                    <div className="relative">
                      <input
                        value={item.returnRate}
                        onChange={(e) => onPortfolioChange(item.id, 'returnRate', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                        placeholder="es. 8"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          onClick={onAddPortfolioItem}
          className="w-full flex items-center justify-center gap-2 text-cyan-400 font-medium py-2.5 px-4 rounded-lg border-2 border-dashed border-slate-600 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-colors text-sm"
        >
          <PlusCircleIcon className="w-5 h-5" />
          {portfolio.length === 0 ? 'Inizia Configurazione' : 'Aggiungi Asset'}
        </button>
        
        {portfolio.length > 0 && (
          <div className="bg-slate-900/30 rounded-lg p-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Totale allocazione:</span>
              <span className={`font-medium ${
                Math.abs(portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) - 100) < 0.01
                  ? 'text-green-400' 
                  : 'text-yellow-400'
              }`}>
                {portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(1)}%
              </span>
            </div>
            {Math.abs(portfolio.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) - 100) > 0.01 && (
              <p className="text-xs text-yellow-400 mt-1">
                ⚠️ L'allocazione deve sommare al 100%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

PortfolioManager.displayName = 'PortfolioManager';

export default PortfolioManager;
