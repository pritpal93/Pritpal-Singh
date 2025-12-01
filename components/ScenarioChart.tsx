import React from 'react';
import { Scenario, Language } from '../types';
import { translations } from '../translations';

interface ScenarioChartProps {
  scenarios: Scenario[];
  language: Language;
}

export const ScenarioChart: React.FC<ScenarioChartProps> = ({ scenarios, language }) => {
  const size = 300;
  const center = size / 2;
  const radius = 90;
  const t = translations[language];

  // Metrics configuration
  const axes = [
    { label: t.upside, key: 'pros' },
    { label: 'Complexity', key: 'steps' }, // Complexity usually stays technical or can be added to translations if desired
    { label: t.risk, key: 'risk' },
    { label: t.friction, key: 'cons' },
  ];

  // Helper to convert risk to number
  const getRiskValue = (level: string) => {
    // We need to handle localized risk levels if they come back localized from API, 
    // but the API is instructed to return Low/Medium/High enum in schema usually. 
    // If the model translates the enum values, we might need a safer check, but usually enums in schema are respected.
    // However, if the model returns localized strings for "High", "Medium", "Low", we should handle it.
    // For now, let's assume standard EN enum or mapped values.
    const l = level.toLowerCase();
    if (l.includes('high') || l.includes('alt') || l.includes('hoch') || l.includes('haut') || l.includes('高')) return 10;
    if (l.includes('medium') || l.includes('med') || l.includes('mittel') || l.includes('moyen') || l.includes('中')) return 6;
    if (l.includes('low') || l.includes('baj') || l.includes('nied') || l.includes('bas') || l.includes('低')) return 3;
    return 5;
  };

  // Helper to get raw value
  const getValue = (scenario: Scenario, key: string) => {
    switch (key) {
      case 'pros': return scenario.pros.length;
      case 'cons': return scenario.cons.length;
      case 'steps': return scenario.steps.length;
      case 'risk': return getRiskValue(scenario.riskLevel);
      default: return 0;
    }
  };

  // Calculate max values for normalization
  const maxValues = axes.reduce((acc, axis) => {
    const max = Math.max(...scenarios.map(s => getValue(s, axis.key)));
    // Ensure we have a reasonable baseline (e.g., at least 5 for counts) so charts aren't tiny
    acc[axis.key] = Math.max(max, 5); 
    if (axis.key === 'risk') acc[axis.key] = 10; // Risk is always out of 10
    return acc;
  }, {} as Record<string, number>);

  // Generate polygon points
  const getPoints = (scenario: Scenario) => {
    return axes.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
      const value = getValue(scenario, axis.key);
      const normalized = value / maxValues[axis.key];
      // Scale to radius (min 20% to show point)
      const r = radius * (0.2 + 0.8 * normalized);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px]">
            {/* Background Grid */}
            <svg width={size} height={size} className="overflow-visible">
                {/* Concentric circles */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                    <circle 
                        key={i} 
                        cx={center} 
                        cy={center} 
                        r={radius * scale} 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                    />
                ))}
                
                {/* Axes */}
                {axes.map((axis, i) => {
                    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <line 
                            key={i} 
                            x1={center} 
                            y1={center} 
                            x2={x} 
                            y2={y} 
                            stroke="#e2e8f0" 
                            strokeWidth="1" 
                        />
                    );
                })}

                {/* Scenario Polygons */}
                {scenarios.map((scenario, idx) => {
                    const isFirst = idx === 0;
                    const color = isFirst ? '#4f46e5' : '#f97316'; // Indigo vs Orange
                    const bg = isFirst ? 'rgba(79, 70, 229, 0.15)' : 'rgba(249, 115, 22, 0.15)';
                    
                    return (
                        <polygon
                            key={idx}
                            points={getPoints(scenario)}
                            fill={bg}
                            stroke={color}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}

                {/* Labels */}
                {axes.map((axis, i) => {
                    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
                    // Push labels out a bit further
                    const labelRadius = radius + 25; 
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);
                    
                    return (
                        <g key={i} transform={`translate(${x}, ${y})`}>
                            <text 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                className="text-[10px] font-bold uppercase tracking-wider fill-slate-500"
                            >
                                {axis.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 mt-2">
            {scenarios.map((scenario, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-orange-500'}`}></div>
                    <span className={`text-xs font-bold ${idx === 0 ? 'text-indigo-900' : 'text-orange-900'}`}>
                        {scenario.name}
                    </span>
                </div>
            ))}
        </div>
    </div>
  );
};