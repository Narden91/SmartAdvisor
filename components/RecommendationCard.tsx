
import React from 'react';
import { FinancialAdvice } from '../types';
import { SparklesIcon, PiggyBankIcon, DocumentDuplicateIcon } from './icons';

interface RecommendationCardProps {
  advice: FinancialAdvice | null;
  isLoading: boolean;
}

const recommendationConfigs = {
    PRESTITO: {
        text: 'Strategia Ottimale: Richiedi il Finanziamento',
        Icon: DocumentDuplicateIcon,
        colorClasses: 'text-cyan-400',
        bgClasses: 'bg-cyan-500/10 border-cyan-500/30',
    },
    RISPARMI: {
        text: 'Strategia Ottimale: Usa i Tuoi Risparmi',
        Icon: PiggyBankIcon,
        colorClasses: 'text-emerald-400',
        bgClasses: 'bg-emerald-500/10 border-emerald-500/30',
    },
    INDOCISO: {
        text: 'Decisione Complessa: Valuta i Pro e Contro',
        Icon: DocumentDuplicateIcon,
        colorClasses: 'text-amber-400',
        bgClasses: 'bg-amber-500/10 border-amber-500/30',
    }
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ advice, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-7 h-7 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Consiglio dell'IA</h2>
        </div>
        <div className="h-8 bg-slate-700 rounded-lg w-2/3 mb-5"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!advice) {
    return null;
  }

  const config = recommendationConfigs[advice.recommendation] || recommendationConfigs.INDOCISO;
  const { Icon, text, colorClasses, bgClasses } = config;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700/80">
      <div className="flex items-center gap-3 mb-5">
        <SparklesIcon className="w-7 h-7 text-cyan-400" />
        <h2 className="heading-h2 text-white">Consiglio dell'IA</h2>
      </div>
      
      <div className={`p-4 rounded-xl border ${bgClasses} mb-5`}>
        <div className="flex items-center gap-4">
            <Icon className={`w-10 h-10 ${colorClasses}`} />
            <div>
                <p className={`body-lg font-bold ${colorClasses}`}>
                {text}
                </p>
                <p className="body text-slate-300 mt-1">{advice.summary}</p>
            </div>
        </div>
      </div>

      <div>
        <h3 className="heading-h3 text-white mb-2">Analisi Dettagliata</h3>
        <p className="body text-slate-300 leading-relaxed">{advice.detailedAnalysis}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
