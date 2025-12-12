import React from 'react';
import { AnalysisMode, MODE_CONFIG } from '../types';
import * as Icons from 'lucide-react';

interface SidebarProps {
  currentMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentMode, 
  onSelectMode, 
  isDemoMode, 
  onToggleDemo,
  isLoading 
}) => {
  return (
    <div className="w-64 bg-cyber-black border-r border-cyber-light flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-cyber-light">
        <h1 className="text-xl font-bold font-sans tracking-tight text-white">
          GEMINI <span className="text-neon-blue">3.0 PRO</span>
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Multimodal Engine</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Analysis Protocols
        </div>
        <nav className="space-y-1 px-2">
          {Object.values(MODE_CONFIG).map((config) => {
            const IconComponent = (Icons as any)[config.icon];
            const isActive = currentMode === config.id;
            
            return (
              <button
                key={config.id}
                onClick={() => !isLoading && onSelectMode(config.id)}
                disabled={isLoading}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 group
                  ${isActive 
                    ? `bg-opacity-10 ${config.color} bg-white border-l-2 ${config.borderColor}` 
                    : 'text-gray-400 hover:bg-cyber-dark hover:text-white border-l-2 border-transparent'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <IconComponent className={`mr-3 h-5 w-5 ${isActive ? config.color : 'text-gray-500 group-hover:text-white'}`} />
                <span className="truncate">{config.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-cyber-light bg-cyber-dark/30">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Demo Simulation</span>
          <button 
            onClick={!isLoading ? onToggleDemo : undefined}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-cyber-black
              ${isDemoMode ? 'bg-neon-blue' : 'bg-gray-700'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isDemoMode ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
};