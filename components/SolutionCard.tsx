import React, { useState } from 'react';
import { SolutionData, TuningParams, Language } from '../types';
import { Check, ArrowRight, Compass, Zap, Shield, ChevronRight, ThumbsUp, ThumbsDown, Scale, Sliders, RefreshCw } from 'lucide-react';
import { TrajectoryVisualizer } from './TrajectoryVisualizer';
import { ScenarioChart } from './ScenarioChart';
import { translations } from '../translations';

interface SolutionCardProps {
  data: SolutionData;
  onReset: () => void;
  onOptimize: (params: TuningParams) => void;
  language: Language;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ data, onReset, onOptimize, language }) => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [showTuner, setShowTuner] = useState(false);
  
  const t = translations[language];

  // Tuning State
  const [tuningParams, setTuningParams] = useState<TuningParams>({
      riskTolerance: 50,
      velocity: 50,
      innovation: 50
  });

  // Feedback State
  const [feedbackStep, setFeedbackStep] = useState<'idle' | 'rating-selected' | 'submitted'>('idle');
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');

  const activeScenario = data.scenarios[activeScenarioIndex];
  
  // Theme helpers
  const isSteady = activeScenario.name.toLowerCase().includes('steady') || activeScenario.riskLevel === 'Low';
  const themeColor = isSteady ? 'indigo' : 'orange';
  const gradient = isSteady ? 'from-indigo-600 to-blue-600' : 'from-orange-600 to-rose-600';
  const lightBg = isSteady ? 'bg-indigo-50' : 'bg-orange-50';
  const textColor = isSteady ? 'text-indigo-600' : 'text-orange-600';

  const handleRating = (type: 'up' | 'down') => {
    setRating(type);
    setFeedbackStep('rating-selected');
  };

  const handleSubmitFeedback = () => {
    // Store feedback locally
    const feedbackItem = {
      timestamp: new Date().toISOString(),
      rating,
      comment,
      solutionTitle: data.title
    };

    try {
        const existing = JSON.parse(localStorage.getItem('orbit_feedback') || '[]');
        localStorage.setItem('orbit_feedback', JSON.stringify([...existing, feedbackItem]));
    } catch (e) {
        console.error("Failed to save local feedback", e);
    }

    setFeedbackStep('submitted');
  };
  
  const handleOptimizeSubmit = () => {
      onOptimize(tuningParams);
      setShowTuner(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-12">
      
      {/* Header Summary */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 relative overflow-hidden text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3 justify-center md:justify-start">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
                        <Compass className="w-3 h-3" /> {t.missionBrief}
                    </div>
                    <button 
                        onClick={() => setShowTuner(!showTuner)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${showTuner ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Sliders className="w-3 h-3" /> {t.flightParameters}
                    </button>
                </div>
                
                {/* Parameter Tuner Panel */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showTuner ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
                        <div className="space-y-4">
                            {/* Risk Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <span>{t.safe}</span>
                                    <span className="text-slate-900">{t.riskTolerance}: {tuningParams.riskTolerance}%</span>
                                    <span>{t.bold}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={tuningParams.riskTolerance} 
                                    onChange={(e) => setTuningParams({...tuningParams, riskTolerance: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                            </div>

                            {/* Velocity Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <span>{t.sustainable}</span>
                                    <span className="text-slate-900">{t.velocity}: {tuningParams.velocity}%</span>
                                    <span>{t.immediate}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={tuningParams.velocity} 
                                    onChange={(e) => setTuningParams({...tuningParams, velocity: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                            </div>

                             {/* Innovation Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <span>{t.pragmatic}</span>
                                    <span className="text-slate-900">{t.innovation}: {tuningParams.innovation}%</span>
                                    <span>{t.radical}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={tuningParams.innovation} 
                                    onChange={(e) => setTuningParams({...tuningParams, innovation: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handleOptimizeSubmit}
                                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors shadow-lg"
                            >
                                <RefreshCw className="w-3 h-3" /> {t.reAlign}
                            </button>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 font-display leading-tight">{data.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed font-light">{data.summary}</p>
            </div>
             {/* Ignition Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl md:w-1/3 flex-shrink-0 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <h3 className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> {t.ignitionPoint}
                </h3>
                <p className="font-semibold text-lg leading-snug">{data.immediateAction}</p>
            </div>
        </div>
      </div>

      {/* Scenario Tabs & Comparison Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Tabs */}
        <div className="flex flex-1 gap-4">
            {data.scenarios.map((scenario, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        setActiveScenarioIndex(idx);
                        setIsComparing(false);
                    }}
                    className={`
                        relative flex-1 p-4 rounded-2xl border-2 transition-all duration-300 text-left group
                        ${activeScenarioIndex === idx && !isComparing
                            ? 'border-transparent bg-white shadow-xl scale-[1.02]' 
                            : 'border-white/40 bg-white/40 hover:bg-white/60 text-slate-500'}
                    `}
                >
                    {activeScenarioIndex === idx && !isComparing && (
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${idx === 0 ? 'from-indigo-500/10 to-blue-500/10' : 'from-orange-500/10 to-rose-500/10'} -z-10`}></div>
                    )}
                    
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold uppercase tracking-widest ${activeScenarioIndex === idx && !isComparing ? (idx === 0 ? 'text-indigo-600' : 'text-orange-600') : 'text-slate-400'}`}>
                            {t.option} 0{idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            scenario.riskLevel === 'High' ? 'bg-rose-100 text-rose-600' : 
                            scenario.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                            {scenario.riskLevel} {t.risk}
                        </span>
                    </div>
                    <h3 className={`text-lg font-bold font-display ${activeScenarioIndex === idx && !isComparing ? 'text-slate-900' : 'text-slate-600'}`}>
                        {scenario.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{scenario.tagline}</p>
                </button>
            ))}
        </div>

        {/* Compare Button */}
        <button
            onClick={() => setIsComparing(!isComparing)}
            className={`
                flex flex-col md:flex-row items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 font-bold transition-all flex-shrink-0 h-full
                ${isComparing 
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xl' 
                    : 'bg-white/40 border-white/40 text-slate-500 hover:bg-white hover:text-slate-700 hover:border-white'}
            `}
        >
            <Scale className="w-5 h-5" />
            <span className="text-sm">{t.compare}</span>
        </button>
      </div>

      {/* Main Content Area: Conditional Rendering */}
      {isComparing ? (
        /* Comparison View */
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-white/60 overflow-hidden p-6 md:p-8 animate-fade-in">
             <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-800 font-display">{t.trajectoryAnalysis}</h3>
                <p className="text-slate-500 text-sm">{t.weighingVariables}</p>
             </div>

             {/* Chart Section */}
             <div className="mb-12 border-b border-slate-100 pb-8">
                <ScenarioChart scenarios={data.scenarios} language={language} />
             </div>
             
             {/* Text Comparison */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Vertical Divider for Desktop */}
                <div className="hidden md:block absolute top-10 bottom-10 left-1/2 w-px bg-slate-200 -ml-px"></div>

                {data.scenarios.map((scenario, idx) => (
                    <div key={idx} className="space-y-6">
                        {/* Header for column */}
                        <div className={`p-5 rounded-2xl border ${idx === 0 ? 'bg-indigo-50/50 border-indigo-100' : 'bg-orange-50/50 border-orange-100'}`}>
                           <div className="flex justify-between items-center mb-2">
                               <span className={`text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                  {t.option} 0{idx + 1}
                               </span>
                               <span className="text-[10px] font-bold uppercase bg-white/50 px-2 py-1 rounded text-slate-500 border border-slate-100">
                                   {scenario.riskLevel} {t.risk}
                               </span>
                           </div>
                           <h3 className="text-xl font-bold font-display text-slate-900">{scenario.name}</h3>
                           <p className="text-sm text-slate-600 mt-1">{scenario.tagline}</p>
                        </div>
                        
                        {/* Pros */}
                        <div>
                             <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                                <Zap className="w-3 h-3" /> {t.upside}
                             </h4>
                             <ul className="space-y-3">
                                {scenario.pros.map((pro, i) => (
                                    <li key={i} className="text-sm text-slate-700 bg-white/60 p-3 rounded-xl border border-emerald-100/50 flex gap-3 shadow-sm">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{pro}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>

                         {/* Cons */}
                        <div>
                             <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                                <Shield className="w-3 h-3" /> {t.friction}
                             </h4>
                             <ul className="space-y-3">
                                {scenario.cons.map((con, i) => (
                                    <li key={i} className="text-sm text-slate-700 bg-white/60 p-3 rounded-xl border border-rose-100/50 flex gap-3 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0"></div>
                                        <span>{con}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      ) : (
        /* Detailed View (Original) */
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-sm border border-white/60 overflow-hidden transition-all duration-500">
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`}></div>
            
            <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* Steps Column */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textColor}`}>
                            <Check className="w-5 h-5" /> {t.executionPlan}
                            </h3>
                            <div className="space-y-4">
                                {activeScenario.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={`
                                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mt-0.5
                                            ${lightBg} ${textColor}
                                        `}>
                                            {i + 1}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visualizer */}
                        <div className="pt-4 border-t border-slate-100">
                            <TrajectoryVisualizer timeline={activeScenario.timeline} colorTheme={themeColor} language={language} />
                        </div>
                    </div>

                    {/* Sidebar: Pros/Cons (Hidden in Compare Mode, Visible in Detail Mode) */}
                    <div className="md:w-72 space-y-6 flex-shrink-0">
                        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap className="w-3 h-3" /> {t.upside}
                            </h4>
                            <ul className="space-y-2">
                                {activeScenario.pros.map((pro, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                                        <span className="text-emerald-400 mt-1">•</span> {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50">
                            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Shield className="w-3 h-3" /> {t.friction}
                            </h4>
                            <ul className="space-y-2">
                                {activeScenario.cons.map((con, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                                        <span className="text-rose-400 mt-1">•</span> {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Footer / Feedback */}
      <div className="flex flex-col items-center justify-center pt-8 space-y-4 w-full max-w-md mx-auto">
        
        {feedbackStep === 'idle' && (
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/40 shadow-sm transition-all hover:bg-white/60">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mr-2">{t.wasThisHelpful}</span>
                <button 
                    onClick={() => handleRating('up')}
                    className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-emerald-500 transition-all hover:scale-110"
                >
                    <ThumbsUp className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300"></div>
                <button 
                    onClick={() => handleRating('down')}
                    className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-all hover:scale-110"
                >
                    <ThumbsDown className="w-4 h-4" />
                </button>
            </div>
        )}

        {feedbackStep === 'rating-selected' && (
            <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 animate-fade-in">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {rating === 'up' ? 'What worked well?' : 'How can we improve?'}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setRating('up')}
                            className={`p-1.5 rounded-full transition-colors ${rating === 'up' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-300 hover:text-emerald-500'}`}
                        >
                            <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button 
                            onClick={() => setRating('down')}
                            className={`p-1.5 rounded-full transition-colors ${rating === 'down' ? 'bg-rose-100 text-rose-600' : 'text-slate-300 hover:text-rose-500'}`}
                        >
                            <ThumbsDown className="w-3 h-3" />
                        </button>
                    </div>
                 </div>
                 <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none h-20 mb-3"
                 />
                 <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setFeedbackStep('idle')}
                        className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmitFeedback}
                        className="px-6 py-2 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        {t.sendFeedback}
                    </button>
                 </div>
            </div>
        )}

        {feedbackStep === 'submitted' && (
            <div className="text-emerald-600 text-sm font-medium animate-fade-in bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 flex items-center gap-2 shadow-sm">
                <Check className="w-4 h-4" />
                <span>Signal received. Calibration updated.</span>
            </div>
        )}

        <button 
          onClick={onReset}
          className="group relative px-8 py-3 rounded-full font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 overflow-hidden hover:text-orange-600 hover:border-orange-200 transition-all mt-4"
        >
          <span className="relative z-10 flex items-center gap-2">{t.recalculate} <ChevronRight className="w-4 h-4" /></span>
          <div className="absolute inset-0 bg-orange-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </button>
      </div>

    </div>
  );
};