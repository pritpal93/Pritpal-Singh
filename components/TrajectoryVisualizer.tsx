import React from 'react';
import { TimelineEvent, Language } from '../types';
import { translations } from '../translations';

interface TrajectoryVisualizerProps {
  timeline: TimelineEvent[];
  colorTheme: 'orange' | 'rose' | 'indigo';
  language: Language;
}

export const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({ timeline, colorTheme, language }) => {
  const t = translations[language];

  const getThemeColors = () => {
    switch(colorTheme) {
      case 'rose': return 'from-rose-500 to-purple-600';
      case 'indigo': return 'from-indigo-500 to-blue-600';
      default: return 'from-orange-500 to-amber-500';
    }
  };

  const getDotColor = () => {
    switch(colorTheme) {
      case 'rose': return 'bg-rose-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-orange-500';
    }
  };

  return (
    <div className="w-full py-6">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">{t.projectedTimeline}</h4>
      
      <div className="relative">
        {/* Horizontal Line (Desktop) / Vertical Line (Mobile) */}
        <div className="hidden md:block absolute top-[15px] left-0 right-0 h-0.5 bg-slate-200 rounded-full"></div>
        <div className="md:hidden absolute left-[15px] top-0 bottom-0 w-0.5 bg-slate-200 rounded-full"></div>

        <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-4">
          {timeline.map((event, index) => (
            <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 relative group">
              
              {/* Dot */}
              <div className={`
                 relative z-10 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center
                 transition-transform duration-300 group-hover:scale-110
                 ${getDotColor()}
              `}>
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              </div>

              {/* Content */}
              <div className="md:text-center pt-0 md:pt-4 flex-1">
                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md mb-1">
                    {event.label}
                </span>
                <h5 className="font-bold text-slate-800 text-sm md:text-base leading-tight mb-1">{event.description}</h5>
                <span className="text-xs font-medium text-slate-500">{event.timeEstimate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};