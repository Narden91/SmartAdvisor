import React from 'react';
import { AllLoanInputs } from '../../types';

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

interface InputFieldProps { 
  label: string; 
  name: keyof AllLoanInputs; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  type?: 'text' | 'number'; 
  adornment?: string; 
  placeholder?: string;
  tooltip: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  adornment, 
  placeholder,
  tooltip 
}) => {
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-slate-300">{label}</label>
        <InfoTooltip text={tooltip} />
      </div>
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
});

InputField.displayName = 'InputField';

export default InputField;
