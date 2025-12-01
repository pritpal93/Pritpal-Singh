import React, { useState } from 'react';
import { ProblemInput } from './components/ProblemInput';
import { SolutionCard } from './components/SolutionCard';
import { LoadingView } from './components/LoadingView';
import { generateSolution } from './services/geminiService';
import { SolutionData, LoadingState, UserInput, TuningParams, Language } from './types';
import { Compass, Globe } from 'lucide-react';
import { translations, languages } from './translations';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' });
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [currentInput, setCurrentInput] = useState<UserInput | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = translations[currentLanguage];

  const handleSolve = async (input: UserInput) => {
    setLoadingState({ status: 'loading' });
    setSolution(null);
    setCurrentInput(input);
    
    try {
      const result = await generateSolution(input, currentLanguage);
      setSolution(result);
      setLoadingState({ status: 'success' });
    } catch (error) {
      console.error(error);
      setLoadingState({ 
        status: 'error', 
        message: t.connectionInterrupted || "Signal interference detected."
      });
    }
  };

  const handleOptimize = async (tuning: TuningParams) => {
    if (!currentInput) return;
    
    setLoadingState({ status: 'loading', message: "Recalibrating trajectory..." });
    // Keep solution visible ideally, but for now we transition to loading to show work
    setSolution(null);

    try {
      const result = await generateSolution(currentInput, currentLanguage, tuning);
      setSolution(result);
      setLoadingState({ status: 'success' });
    } catch (error) {
        console.error(error);
        setLoadingState({ 
          status: 'error', 
          message: t.connectionInterrupted || "Failed to optimize trajectory." 
        });
    }
  };

  const handleReset = () => {
    setSolution(null);
    setLoadingState({ status: 'idle' });
    setCurrentInput(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/30 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset} role="button">
            {/* Logo Icon */}
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight font-display group-hover:text-orange-600 transition-colors">Orbit</span>
          </div>
          
          <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white border border-white/60 text-sm font-medium text-slate-600 transition-all"
                  >
                      <Globe className="w-4 h-4" />
                      <span className="uppercase">{currentLanguage}</span>
                  </button>
                  
                  {isLangMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-y-auto max-h-80 py-1 animate-fade-in z-50">
                          {languages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                    setCurrentLanguage(lang.code);
                                    setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${currentLanguage === lang.code ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-600'}`}
                              >
                                  <span className="text-lg">{lang.flag}</span>
                                  <span>{lang.label}</span>
                              </button>
                          ))}
                      </div>
                  )}
              </div>

              {/* Status Indicator / Reset Button */}
              {loadingState.status === 'success' && (
                <button onClick={handleReset} className="hidden md:block text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-wider">
                  New
                </button>
              )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 md:px-8 relative z-10">
        
        {loadingState.status === 'idle' && (
          <div className="w-full py-16 md:py-24">
            <ProblemInput onSubmit={handleSolve} isLoading={false} language={currentLanguage} />
          </div>
        )}

        {loadingState.status === 'loading' && (
          <div className="w-full py-16 md:py-24">
            <LoadingView language={currentLanguage} />
          </div>
        )}

        {loadingState.status === 'error' && (
          <div className="w-full max-w-md mx-auto text-center py-24 space-y-6 animate-fade-in">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <div>
               <h3 className="text-2xl font-bold text-slate-800 font-display">{t.connectionInterrupted}</h3>
               <p className="text-slate-500 mt-2">{loadingState.message}</p>
             </div>
             <button 
                onClick={handleReset}
                className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
             >
               {t.reconnect}
             </button>
          </div>
        )}

        {loadingState.status === 'success' && solution && (
          <div className="w-full py-8 md:py-12">
            <SolutionCard 
                data={solution} 
                onReset={handleReset} 
                onOptimize={handleOptimize}
                language={currentLanguage}
            />
          </div>
        )}

      </main>
      
      <footer className="py-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest relative z-10">
        <p>Orbit AI • Strategic alignment, not medical advice.</p>
      </footer>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-fade-in-up {
           animation: fadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .font-display {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;