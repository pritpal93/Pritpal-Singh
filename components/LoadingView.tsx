import React, { useState, useEffect } from 'react';
import { Map, Compass, Route, Flag } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LoadingViewProps {
  language: Language;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ language }) => {
  const [step, setStep] = useState(0);
  const t = translations[language];
  
  const steps = [
    { text: t.loadingSteps[0], icon: Map },
    { text: t.loadingSteps[1], icon: Compass },
    { text: t.loadingSteps[2], icon: Route },
    { text: t.loadingSteps[3], icon: Flag }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1800); 
    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto space-y-10 text-center relative overflow-hidden p-8 rounded-3xl">
      {/* CSS for custom animations */}
      <style>{`
        @keyframes ripple {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.2); opacity: 0; }
        }
        .animate-ripple {
            animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .delay-1000 { animation-delay: 1000ms; }
        
        @keyframes progress-grow {
            0% { transform: scaleX(0.05); }
            100% { transform: scaleX(0.95); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        @keyframes float-particle {
           0% { transform: translateY(40px) scale(0.5); opacity: 0; }
           20% { opacity: 0.6; }
           100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }
        .particle {
           position: absolute;
           background: linear-gradient(135deg, #fb923c 0%, #f43f5e 100%); /* orange-400 to rose-500 */
           border-radius: 50%;
           pointer-events: none;
           filter: blur(1px);
        }
      `}</style>

      {/* Background Particles - Warm colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle w-3 h-3 left-[20%] bottom-0 animate-[float-particle_4s_ease-out_infinite]" style={{animationDelay: '0s'}}></div>
        <div className="particle w-2 h-2 left-[70%] bottom-0 animate-[float-particle_5s_ease-out_infinite]" style={{animationDelay: '1.2s'}}></div>
        <div className="particle w-4 h-4 left-[40%] bottom-0 animate-[float-particle_6s_ease-out_infinite]" style={{animationDelay: '2.5s'}}></div>
        <div className="particle w-2.5 h-2.5 left-[85%] bottom-0 animate-[float-particle_4.5s_ease-out_infinite]" style={{animationDelay: '0.5s'}}></div>
        <div className="particle w-1.5 h-1.5 left-[10%] bottom-0 animate-[float-particle_5.5s_ease-out_infinite]" style={{animationDelay: '3s'}}></div>
        <div className="particle w-3 h-3 left-[60%] bottom-0 animate-[float-particle_7s_ease-out_infinite]" style={{animationDelay: '1.8s'}}></div>
      </div>

      <div className="relative flex items-center justify-center py-4 z-10">
         {/* Ripples - Warm colors */}
         <div className="absolute w-32 h-32 bg-orange-100 rounded-full animate-ripple"></div>
         <div className="absolute w-32 h-32 bg-rose-100 rounded-full animate-ripple delay-1000"></div>
         
         {/* Orbital Rings - Warm colors */}
         <div className="absolute w-48 h-48 border border-white/50 rounded-full animate-[spin_8s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"></div>
         </div>
         <div className="absolute w-40 h-40 border border-white/50 rounded-full animate-[spin_6s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2.5 h-2.5 bg-rose-400 rounded-full shadow-lg shadow-rose-400/50"></div>
         </div>

         {/* Center Icon Card */}
         <div className="relative z-10 w-24 h-24 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl flex items-center justify-center border border-white/50 transition-all duration-500 transform">
            <CurrentIcon className="w-10 h-10 text-orange-600 animate-pulse" />
         </div>
      </div>

      <div className="space-y-3 z-10 max-w-md">
        <h3 className="text-2xl font-bold text-slate-800 min-h-[2rem] transition-opacity duration-300 font-display">
            {steps[step].text}
        </h3>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">{t.calculating}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-slate-200/50 rounded-full h-1.5 overflow-hidden relative backdrop-blur-sm z-10">
        {/* Fill */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full w-full origin-left animate-[progress-grow_5s_ease-out_forwards]"></div>
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
};