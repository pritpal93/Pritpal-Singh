import React, { useState } from 'react';
import { Navigation, MapPin, Route, Compass, Zap, Settings, Target, Clock } from 'lucide-react';
import { UserInput, Language } from '../types';
import { translations } from '../translations';

interface ProblemInputProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
  language: Language;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, isLoading, language }) => {
  const [problem, setProblem] = useState('');
  const [goal, setGoal] = useState('');
  const [constraints, setConstraints] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim() && !isLoading) {
      onSubmit({ problem, goal, constraints });
    }
  };

  const handleSuggestionClick = (text: string) => {
    setProblem(text);
  };

  const suggestionIcons = [
      <Compass className="w-4 h-4" />,
      <Route className="w-4 h-4" />,
      <MapPin className="w-4 h-4" />,
      <Zap className="w-4 h-4" />
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 tracking-tight pb-2">
          {t.tagline}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-light max-w-lg mx-auto">
          {t.subTagline}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group perspective-1000">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2 overflow-hidden transition-all duration-300">
          
          {/* Main Problem Input */}
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={t.placeholder}
            className="w-full min-h-[120px] p-6 text-xl text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none resize-none font-light leading-relaxed rounded-xl"
            disabled={isLoading}
          />

          {/* Advanced Toggles */}
          <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${showAdvanced ? 'max-h-[300px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                   <Target className="w-3 h-3" /> {t.goal}
                 </label>
                 <input 
                   type="text" 
                   value={goal}
                   onChange={(e) => setGoal(e.target.value)}
                   placeholder="..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                 />
               </div>
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
                   <Clock className="w-3 h-3" /> {t.constraints}
                 </label>
                 <input 
                   type="text" 
                   value={constraints}
                   onChange={(e) => setConstraints(e.target.value)}
                   placeholder="..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                 />
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4 pb-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors px-2 py-1 rounded-md hover:bg-orange-50"
            >
              <Settings className="w-3 h-3" />
              {showAdvanced ? t.hideAdvanced : t.advanced}
            </button>
            
            <button
              type="submit"
              disabled={!problem.trim() || isLoading}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                !problem.trim() || isLoading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-lg hover:shadow-orange-500/30'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                   {t.calculating}
                </span>
              ) : (
                <>
                  {t.launch} <Navigation className="w-4 h-4 fill-current" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-[0.2em]">{t.commonTrajectories}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.suggestions.map((suggestionText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(suggestionText)}
              className="flex items-center gap-4 p-4 text-left bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl hover:bg-white hover:border-orange-200 hover:shadow-md transition-all group/btn"
            >
              <div className="p-2.5 bg-orange-50 text-orange-500 rounded-full group-hover/btn:bg-orange-500 group-hover/btn:text-white transition-all duration-300 flex-shrink-0">
                {suggestionIcons[idx % suggestionIcons.length]}
              </div>
              <span className="text-sm text-slate-700 font-medium">{suggestionText}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};