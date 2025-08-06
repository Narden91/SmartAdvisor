import React from 'react';

interface InvestmentFormProps {
  investmentAmount: string;
  timeHorizonYears: string;
  riskTolerance: 'low' | 'medium' | 'high';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adornment?: string;
  placeholder?: string;
}> = ({ label, name, value, onChange, adornment, placeholder }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        placeholder={placeholder || (adornment === '€' ? 'es. 10000' : 'es. 10')}
      />
      {adornment && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
          {adornment}
        </span>
      )}
    </div>
  </div>
);

const InvestmentForm: React.FC<InvestmentFormProps> = React.memo(({
  investmentAmount,
  timeHorizonYears,
  riskTolerance,
  onInputChange,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <h2 className="text-xl font-bold text-white mb-2">Parametri di Analisi</h2>
      <p className="text-slate-400 mb-4">Configura i tuoi parametri di investimento.</p>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Importo da Investire"
          name="investmentAmount"
          value={investmentAmount}
          onChange={onInputChange}
          adornment="€"
          placeholder="es. 10000"
        />
        
        <InputField
          label="Orizzonte Temporale"
          name="timeHorizonYears"
          value={timeHorizonYears}
          onChange={onInputChange}
          adornment="anni"
          placeholder="es. 10"
        />

        <div className="space-y-2">
          <label htmlFor="riskTolerance" className="block text-sm font-medium text-slate-300">
            Tolleranza al Rischio
          </label>
          <select
            id="riskTolerance"
            name="riskTolerance"
            value={riskTolerance}
            onChange={onInputChange}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="low">Conservativa (Basso Rischio)</option>
            <option value="medium">Moderata (Rischio Medio)</option>
            <option value="high">Aggressiva (Alto Rischio)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Calcolando...
            </>
          ) : (
            'Analizza Investimento'
          )}
        </button>
      </form>
    </div>
  );
});

InvestmentForm.displayName = 'InvestmentForm';

export default InvestmentForm;
