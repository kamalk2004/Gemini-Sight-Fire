import React from 'react';
import { AlertTriangle, CheckCircle, AlertOctagon, Info, FileText } from 'lucide-react';

interface ResultDisplayProps {
  text: string;
}

const parseSection = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return lines.map((line, idx) => {
    // Regex to match [KEY]: Value
    const match = line.match(/^\[([A-Z0-9_]+)\]:(.*)/);
    
    if (match) {
      const key = match[1];
      const value = match[2].trim();
      
      let colorClass = "text-gray-300";
      let icon = <Info className="w-4 h-4 mr-2 text-blue-400" />;
      let bgClass = "bg-cyber-dark";
      let borderClass = "border-gray-700";

      if (key === 'VERDICT' || key === 'FINAL_REPORT') {
        bgClass = "bg-cyber-light/50";
        borderClass = "border-gray-600";
        
        if (value.includes('CRITICAL') || value.includes('DANGER') || value.includes('FAKE') || value.includes('LIABILITY')) {
          colorClass = "text-neon-red font-bold";
          icon = <AlertOctagon className="w-5 h-5 mr-2 text-neon-red" />;
          borderClass = "border-neon-red";
        } else if (value.includes('WARNING') || value.includes('INCONCLUSIVE')) {
          colorClass = "text-neon-amber font-bold";
          icon = <AlertTriangle className="w-5 h-5 mr-2 text-neon-amber" />;
          borderClass = "border-neon-amber";
        } else {
          colorClass = "text-neon-green font-bold";
          icon = <CheckCircle className="w-5 h-5 mr-2 text-neon-green" />;
          borderClass = "border-neon-green";
        }
      }

      return (
        <div key={idx} className={`mb-3 p-3 rounded-md border ${borderClass} ${bgClass} flex items-start animate-fade-in`}>
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
              {key}
            </span>
            <p className={`font-mono text-sm ${colorClass} whitespace-pre-wrap`}>
              {value}
            </p>
          </div>
        </div>
      );
    } else {
      // Regular text (likely part of Final Report or multi-line description)
      return (
        <div key={idx} className="mb-2 pl-9 font-mono text-sm text-gray-300 whitespace-pre-wrap">
          {line}
        </div>
      );
    }
  });
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text }) => {
  return (
    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {parseSection(text)}
    </div>
  );
};