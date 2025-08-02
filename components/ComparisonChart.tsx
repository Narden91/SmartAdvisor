import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';
import { ChartBarIcon } from './icons';


interface ComparisonChartProps {
  data: ChartData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm p-4 border border-slate-700 rounded-lg shadow-lg">
        <p className="label text-white font-bold mb-2">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <p className="text-slate-300">
                {`${entry.name}: `} <span className="font-semibold text-white">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(entry.value)}</span>
                </p>
            </div>
        ))}
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <div className="flex items-center gap-3 mb-5">
        <ChartBarIcon className="w-7 h-7 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Analisi Costi vs. Opportunità</h2>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{stroke: '#475569'}} />
            <YAxis tickFormatter={(value) => `${Number(value / 1000).toLocaleString('it-IT')}k €`} tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{stroke: '#475569'}} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.3)'}}/>
            <Legend wrapperStyle={{ color: '#e2e8f0', paddingTop: '10px' }} />
            <Bar dataKey="Costo Finale Totale" fill="#ef4444" name="Costo Finale del Finanziamento" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Guadagno da Investimento" fill="#34d399" name="Potenziale Guadagno Investimento" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;