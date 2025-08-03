
import React, { useState, useCallback } from 'react';
import { AllLoanInputs, LoanCalculations, FinancialAdvice, ChartData, FinancialProduct, PortfolioItem } from './types';
import { getFinancialAdvice } from './services/geminiService';
import LoanForm from './components/LoanForm';
import ResultsDisplay from './components/ResultsDisplay';
import RecommendationCard from './components/RecommendationCard';
import ComparisonChart from './components/ComparisonChart';
import HomePage from './components/HomePage';
import SalaryCalculator from './components/SalaryCalculator';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import { LogoIcon, SparklesIcon, HomeIcon } from './components/icons';

const initialInputs: AllLoanInputs = {
    capitale: '15000',
    tan: '7.5',
    durataMesi: '60',
    speseIstruttoria: '200',
    costiAssicurativi: '0',
    speseIncassoRata: '2',
    premioAssicurativo: '15',
    commissioniIntermediazione: '300',
    speseGestionePratica: '150',
    spread: '1.5',
    parametroRiferimento: '2.0',
    costiNotarili: '2500',
    assicurazioneObbligatoria: '20',
    impostaSostitutiva: '500',
    liquidSavings: '5000',
    portfolio: [
        { id: '1', name: 'Azioni ETF (VWCE)', amount: '10000', returnRate: '8' },
        { id: '2', name: 'Conto Deposito', amount: '5000', returnRate: '3.5' },
    ],
};

type View = 'home' | 'loanCalculator' | 'salaryCalculator';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  
  // State for Loan Calculator
  const [product, setProduct] = useState<FinancialProduct>('Prestito');
  const [inputs, setInputs] = useState<AllLoanInputs>(initialInputs);
  const [calculations, setCalculations] = useState<LoanCalculations | null>(null);
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- LOAN CALCULATOR LOGIC ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (e.target.inputMode === 'decimal' && value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePortfolioChange = (id: string, field: keyof Omit<PortfolioItem, 'id'>, value: string) => {
    setInputs(prev => ({
        ...prev,
        portfolio: prev.portfolio.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        )
    }));
  };

  const addPortfolioItem = () => {
    setInputs(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { id: Date.now().toString(), name: '', amount: '0', returnRate: '0' }]
    }));
  };

  const removePortfolioItem = (id: string) => {
    setInputs(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(item => item.id !== id)
    }));
  };

  const handleProductChange = (newProduct: FinancialProduct) => {
    setProduct(newProduct);
    const newDefaults: Partial<AllLoanInputs> = {};
    if (newProduct === 'Mutuo') {
        newDefaults.capitale = '200000';
        newDefaults.durataMesi = '300';
        newDefaults.spread = '1.5';
        newDefaults.parametroRiferimento = '2.5';
    } else if (newProduct === 'Prestito') {
        newDefaults.capitale = '15000';
        newDefaults.durataMesi = '60';
        newDefaults.tan = '7.5';
    } else {
        newDefaults.capitale = '8000';
        newDefaults.durataMesi = '36';
        newDefaults.tan = '9.0';
    }
    setInputs(prev => ({ ...initialInputs, ...newDefaults, liquidSavings: prev.liquidSavings, portfolio: prev.portfolio }));
    
    setCalculations(null);
    setAdvice(null);
    setChartData([]);
    setError(null);
  };

  const calculateLoan = useCallback((currentProduct: FinancialProduct, currentInputs: AllLoanInputs): LoanCalculations => {
    const getNum = (val: string) => parseFloat(val) || 0;

    const C = getNum(currentInputs.capitale);
    const n = getNum(currentInputs.durataMesi);

    const calculateRate = (principal: number, monthlyRate: number, periods: number): number => {
      if (principal <= 0 || periods <= 0) return 0;
      if (monthlyRate <= 0) return principal / periods;
      const powerTerm = Math.pow(1 + monthlyRate, periods);
      return principal * (monthlyRate * powerTerm) / (powerTerm - 1);
    };

    switch (currentProduct) {
        case 'Prestito': {
            const i = getNum(currentInputs.tan) / 100;
            const SI = getNum(currentInputs.speseIstruttoria);
            const CA = getNum(currentInputs.costiAssicurativi);
            const SIR = getNum(currentInputs.speseIncassoRata);
            
            const R = calculateRate(C, i / 12, n);
            const CTI = (R * n) - C;
            const CF = CTI + SI + CA + (SIR * n);

            return { rataMensile: R, costoTotaleInteressi: CTI, costoFinale: CF };
        }
        case 'Finanziaria': {
            const i = getNum(currentInputs.tan) / 100;
            const PA = getNum(currentInputs.premioAssicurativo);
            const CI = getNum(currentInputs.commissioniIntermediazione);
            const SGP = getNum(currentInputs.speseGestionePratica);

            const R = calculateRate(C, i / 12, n);
            const CAT = PA * n;
            const CTI = (R * n) - C;
            const CF = CTI + CI + SGP + CAT;

            return { rataMensile: R, costoAssicurativoTotale: CAT, costoFinale: CF };
        }
        case 'Mutuo': {
            const s = getNum(currentInputs.spread);
            const p = getNum(currentInputs.parametroRiferimento);
            const SI = getNum(currentInputs.speseIstruttoria);
            const CN = getNum(currentInputs.costiNotarili);
            const AO = getNum(currentInputs.assicurazioneObbligatoria);
            const IS = getNum(currentInputs.impostaSostitutiva);

            const tanEffettivo = p + s;
            const tanDecimal = tanEffettivo / 100;

            const R = calculateRate(C, tanDecimal / 12, n);
            const IT = (R * n) - C;
            const CF = IT + SI + CN + (AO * n) + IS;
            
            return { tanEffettivo, rataMensile: R, interessiTotali: IT, costoFinale: CF };
        }
        default:
            throw new Error(`Calcolo non implementato per il prodotto: ${currentProduct}`);
    }
  }, []);

  const handleAnalysis = useCallback(async () => {
    setError(null);
    setAdvice(null);
    setCalculations(null);
    setChartData([]);

    const { capitale, durataMesi } = inputs;
    const loanAmountNum = parseFloat(capitale);
    if (isNaN(loanAmountNum) || loanAmountNum <= 0 || parseInt(durataMesi) <= 0) {
      setError("Inserisci un importo e una durata validi per il finanziamento.");
      return;
    }
    
    setIsLoading(true);

    try {
      const loanCalcs = calculateLoan(product, inputs);
      setCalculations(loanCalcs);
      
      const aiAdvice = await getFinancialAdvice(inputs, product, loanCalcs);
      setAdvice(aiAdvice);

      setChartData([
        {
          name: 'Risultato Finanziario',
          'Costo Finale Totale': loanCalcs.costoFinale,
          'Guadagno da Investimento': aiAdvice.projectedInvestmentGrowth,
        }
      ]);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Si è verificato un errore inaspettato.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputs, product, calculateLoan]);

  // --- RENDER LOGIC ---

  const renderLoanCalculator = () => (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <section className="section-sm">
        <div className="container">
          <header className="flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <LogoIcon className="w-14 h-14 text-cyan-400" />
              <div>
                <h1 className="heading-h1 text-white">Consulente Finanziario AI</h1>
                <p className="body text-slate-400 mt-1">Analisi intelligenti per le tue decisioni finanziarie</p>
              </div>
            </div>
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="body">Home</span>
            </button>
          </header>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section flex-1">
        <div className="container">
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            <div className="lg:col-span-1">
              <LoanForm
                inputs={inputs}
                product={product}
                onProductChange={handleProductChange}
                onInputChange={handleInputChange}
                onPortfolioChange={handlePortfolioChange}
                onAddPortfolioItem={addPortfolioItem}
                onRemovePortfolioItem={removePortfolioItem}
                onAnalyze={handleAnalysis}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl">
                  <p className="heading-h3 text-lg">Errore di Analisi</p>
                  <p className="body">{error}</p>
                </div>
              )}
              {isLoading && !calculations && (
                   <div className="flex justify-center items-center h-96 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                      <div className="text-center">
                          <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="body-lg mt-4 font-medium text-slate-300">Sto analizzando il tuo futuro finanziario...</p>
                          <p className="body text-slate-400">L'IA sta elaborando i dati.</p>
                      </div>
                  </div>
              )}
              {(calculations || advice) && !error && (
                <div className="space-y-8">
                  <ResultsDisplay calculations={calculations} product={product} inputs={inputs} />
                  <RecommendationCard advice={advice} isLoading={isLoading && !advice} />
                  {chartData.length > 0 && <ComparisonChart data={chartData} />}
                </div>
              )}
              {!isLoading && !calculations && !error && (
                  <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-dashed border-slate-700">
                      <SparklesIcon className="w-16 h-16 text-cyan-500/50 mb-4" />
                      <h2 className="heading-h2 text-white">Pronto per la tua analisi?</h2>
                      <p className="body mt-2 max-w-sm text-slate-400">Compila i tuoi dati e clicca "Analizza" per ricevere la tua consulenza finanziaria personalizzata dall'IA.</p>
                  </div>
              )}
            </div>
          </main>
        </div>
      </section>

      {/* Footer */}
      <Footer 
        onNavigateToLoanCalculator={() => setView('loanCalculator')}
        onNavigateToSalaryCalculator={() => setView('salaryCalculator')}
        onNavigateToHome={() => setView('home')}
      />
    </div>
  );

  switch (view) {
    case 'loanCalculator':
      return (
        <>
          {renderLoanCalculator()}
          <CookieBanner />
        </>
      );
    case 'salaryCalculator':
      return (
        <>
          <SalaryCalculator 
            onBack={() => setView('home')} 
            onNavigateToLoanCalculator={() => setView('loanCalculator')}
          />
          <CookieBanner />
        </>
      );
    case 'home':
    default:
      return (
        <>
          <HomePage
            onNavigateToLoanCalculator={() => setView('loanCalculator')}
            onNavigateToSalaryCalculator={() => setView('salaryCalculator')}
          />
          <CookieBanner />
        </>
      );
  }
};

export default App;
