
import React from 'react';
import { AllLoanInputs, FinancialProduct, PortfolioItem } from '../types';
import { PrestitoIcon, FinanziariaIcon, MutuoIcon, SparklesIcon, PlusCircleIcon, TrashIcon } from './icons';

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

const InputField: React.FC<{ label: string; name: keyof AllLoanInputs; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: 'text' | 'number'; adornment?: string, placeholder?: string }> = ({ label, name, value, onChange, type = "text", adornment, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        inputMode="decimal"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        placeholder={placeholder || (adornment === '€' ? 'es. 15000' : 'es. 5')}
      />
      {adornment && <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">{adornment}</span>}
    </div>
  </div>
);

const LoanForm: React.FC<LoanFormProps> = ({ inputs, product, onProductChange, onInputChange, onPortfolioChange, onAddPortfolioItem, onRemovePortfolioItem, onAnalyze, isLoading }) => {
  const products: { id: FinancialProduct; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'Prestito', label: 'Prestito', icon: PrestitoIcon },
    { id: 'Finanziaria', label: 'Finanziaria', icon: FinanziariaIcon },
    { id: 'Mutuo', label: 'Mutuo', icon: MutuoIcon },
  ];
  
  const renderProductFields = () => {
    switch(product) {
      case 'Prestito':
        return (
          <>
            <InputField label="Capitale Richiesto (C)" name="capitale" value={inputs.capitale} onChange={onInputChange} adornment="€" />
            <InputField label="TAN (%)" name="tan" value={inputs.tan} onChange={onInputChange} adornment="%" />
            <InputField label="Durata (mesi)" name="durataMesi" value={inputs.durataMesi} onChange={onInputChange} adornment="mesi" placeholder="es. 60" />
            <InputField label="Spese Istruttoria" name="speseIstruttoria" value={inputs.speseIstruttoria} onChange={onInputChange} adornment="€" />
            <InputField label="Costi Assicurativi" name="costiAssicurativi" value={inputs.costiAssicurativi} onChange={onInputChange} adornment="€" />
            <InputField label="Spese Incasso Rata" name="speseIncassoRata" value={inputs.speseIncassoRata} onChange={onInputChange} adornment="€" />
          </>
        );
      case 'Finanziaria':
        return (
          <>
            <InputField label="Capitale Richiesto (C)" name="capitale" value={inputs.capitale} onChange={onInputChange} adornment="€" />
            <InputField label="TAN (%)" name="tan" value={inputs.tan} onChange={onInputChange} adornment="%" />
            <InputField label="Durata (mesi)" name="durataMesi" value={inputs.durataMesi} onChange={onInputChange} adornment="mesi" placeholder="es. 36" />
            <InputField label="Premio Assicurativo Mensile" name="premioAssicurativo" value={inputs.premioAssicurativo} onChange={onInputChange} adornment="€/mese" />
            <InputField label="Commissioni Intermediazione" name="commissioniIntermediazione" value={inputs.commissioniIntermediazione} onChange={onInputChange} adornment="€" />
            <InputField label="Spese Gestione Pratica" name="speseGestionePratica" value={inputs.speseGestionePratica} onChange={onInputChange} adornment="€" />
          </>
        );
      case 'Mutuo':
        return (
          <>
            <InputField label="Capitale Richiesto (C)" name="capitale" value={inputs.capitale} onChange={onInputChange} adornment="€" placeholder="es. 200000" />
            <InputField label="Spread (%)" name="spread" value={inputs.spread} onChange={onInputChange} adornment="%" />
            <InputField label="Parametro Riferimento (%)" name="parametroRiferimento" value={inputs.parametroRiferimento} onChange={onInputChange} adornment="%" />
            <InputField label="Durata (mesi)" name="durataMesi" value={inputs.durataMesi} onChange={onInputChange} adornment="mesi" placeholder="es. 300" />
            <InputField label="Spese Istruttoria" name="speseIstruttoria" value={inputs.speseIstruttoria} onChange={onInputChange} adornment="€" />
            <InputField label="Costi Notarili" name="costiNotarili" value={inputs.costiNotarili} onChange={onInputChange} adornment="€" />
            <InputField label="Assicurazione Obbligatoria Mensile" name="assicurazioneObbligatoria" value={inputs.assicurazioneObbligatoria} onChange={onInputChange} adornment="€/mese" />
            <InputField label="Imposta Sostitutiva" name="impostaSostitutiva" value={inputs.impostaSostitutiva} onChange={onInputChange} adornment="€" />
          </>
        );
    }
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
       <h2 className="text-xl font-bold text-white mb-2">Tipo di Finanziamento</h2>
       <p className="text-slate-400 mb-4">Scegli il prodotto che ti interessa.</p>
       <div className="grid grid-cols-3 gap-3 mb-6">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onProductChange(p.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 transform-gpu ${
              product === p.id
                ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/20 shadow-lg scale-105'
                : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <p.icon className="w-8 h-8 mb-1.5" />
            <span className="text-sm font-semibold">{p.label}</span>
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Dettagli Finanziari</h2>
      <form onSubmit={(e) => { e.preventDefault(); onAnalyze(); }} className="space-y-4">
        
        {renderProductFields()}

        <div className="h-px bg-slate-700 my-6"></div>
        
        <h3 className="text-xl font-bold text-white mb-4 -mt-1">La Tua Situazione</h3>
        <div className="space-y-4">
            <InputField label="Risparmi Liquidi (non investiti)" name="liquidSavings" value={inputs.liquidSavings} onChange={onInputChange} adornment="€" placeholder="es. 5000" />
            
            <div>
                <h4 className="text-lg font-semibold text-white mb-3">Portafoglio Investimenti</h4>
                <div className="space-y-4">
                    {inputs.portfolio.map((item) => (
                        <div key={item.id} className="bg-slate-900/40 p-4 rounded-lg border border-slate-700 space-y-3">
                            <div className="flex justify-between items-center">
                                <label htmlFor={`name-${item.id}`} className="block text-sm font-medium text-slate-300">Voce Portafoglio</label>
                                <button type="button" onClick={() => onRemovePortfolioItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
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
                                    <label htmlFor={`amount-${item.id}`} className="block text-xs font-medium text-slate-400 mb-1">Importo</label>
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
                                    <label htmlFor={`return-${item.id}`} className="block text-xs font-medium text-slate-400 mb-1">Rendimento</label>
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
};

export default LoanForm;
