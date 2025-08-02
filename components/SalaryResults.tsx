
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SalaryCalculationResults } from '../types';

interface SalaryResultsProps {
    results: SalaryCalculationResults;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const ResultCard: React.FC<{ label: string; value: string; isPrimary?: boolean }> = ({ label, value, isPrimary }) => (
    <div className={`p-6 rounded-xl text-center ${isPrimary ? 'bg-cyan-500/10 border-2 border-cyan-500' : 'bg-slate-700/40'}`}>
        <p className="text-sm uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${isPrimary ? 'text-cyan-300' : 'text-white'}`}>{value}</p>
    </div>
);


const SalaryResults: React.FC<SalaryResultsProps> = ({ results }) => {
    const {
        ral,
        nettoAnnuale,
        nettoMensile,
        contributiINPS,
        irpefNetta,
        addizionaleRegionale,
        addizionaleComunale,
    } = results;

    const pieData = [
        { name: 'Stipendio Netto', value: nettoAnnuale, color: '#22d3ee' }, // cyan-400
        { name: 'Contributi INPS', value: contributiINPS, color: '#f43f5e' }, // rose-500
        { name: 'IRPEF Netta', value: irpefNetta, color: '#f97316' }, // orange-500
        { name: 'Addizionali', value: addizionaleRegionale + addizionaleComunale, color: '#eab308' }, // yellow-500
    ];

    return (
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80 space-y-8 animate-fade-in">
            <div>
                 <h2 className="text-2xl font-bold text-white text-center">Risultati del Calcolo</h2>
                 <p className="text-center text-slate-400">Basato su una RAL di {formatCurrency(ral)}</p>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard label="Netto Mensile" value={formatCurrency(nettoMensile)} isPrimary />
                <ResultCard label="Netto Annuale" value={formatCurrency(nettoAnnuale)} />
            </div>

            <div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Ripartizione del Lordo</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                                    borderColor: '#475569',
                                    borderRadius: '0.75rem',
                                    backdropFilter: 'blur(4px)',
                                }}
                                itemStyle={{ color: '#cbd5e1' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Legend iconType="circle" wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }} />
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} >
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div>
                <h3 className="text-xl font-bold text-white text-center mb-4">Dettaglio Imposte e Contributi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">Contributi INPS</p>
                        <p className="font-semibold text-rose-400">{formatCurrency(contributiINPS)}</p>
                    </div>
                     <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">IRPEF Netta</p>
                        <p className="font-semibold text-orange-400">{formatCurrency(irpefNetta)}</p>
                    </div>
                     <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">Add. Regionale</p>
                        <p className="font-semibold text-yellow-400">{formatCurrency(addizionaleRegionale)}</p>
                    </div>
                     <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400">Add. Comunale</p>
                        <p className="font-semibold text-yellow-400">{formatCurrency(addizionaleComunale)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryResults;
