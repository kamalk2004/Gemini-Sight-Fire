import React, { useState, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResultDisplay } from './components/ResultDisplay';
import { AnalysisMode, MODE_CONFIG, MediaFile } from './types';
import { analyzeMedia } from './services/geminiService';
import { Upload, X, Play, Image as ImageIcon, Video, Loader2, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AnalysisMode>(AnalysisMode.INFRASTRUCTURE);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Fix: Explicitly type the map argument to 'File' to resolve 'unknown' type errors from Array.from
      const newFiles: MediaFile[] = Array.from(event.target.files).map((file: File) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = useCallback(async () => {
    if (mediaFiles.length === 0) return;

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const files = mediaFiles.map(m => m.file);
      const result = await analyzeMedia(files, currentMode, isDemoMode);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisResult(`[VERDICT]: SYSTEM ERROR\n[OBSERVATION]: Failed to connect to Gemini API.\n[ERROR]: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [mediaFiles, currentMode, isDemoMode]);

  const activeConfig = MODE_CONFIG[currentMode];

  return (
    <div className="flex h-screen w-screen bg-cyber-black overflow-hidden font-sans text-gray-100">
      <Sidebar 
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        isDemoMode={isDemoMode}
        onToggleDemo={() => setIsDemoMode(!isDemoMode)}
        isLoading={isLoading}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-cyber-light bg-cyber-black/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${activeConfig.bgColor}`}>
               {/* Note: In a real app we'd map the icon string to a component more dynamically, 
                   but strictly typed for simplicity here. */}
               <Cpu className={`w-6 h-6 ${activeConfig.color}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{activeConfig.title}</h2>
              <p className="text-xs text-gray-400 font-mono">
                SYSTEM STATUS: {isLoading ? "PROCESSING..." : "READY"}
              </p>
            </div>
          </div>
          {isDemoMode && (
             <div className="px-3 py-1 bg-neon-blue/20 border border-neon-blue rounded text-xs font-mono text-neon-blue animate-pulse">
               DEMO MODE ACTIVE
             </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden flex flex-row">
          
          {/* Left Panel: Media & Input */}
          <div className="w-1/2 p-6 border-r border-cyber-light flex flex-col overflow-y-auto">
            
            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-all text-center
                ${mediaFiles.length === 0 ? 'h-64 flex flex-col justify-center items-center' : 'h-auto'}
                ${isLoading ? 'border-gray-700 opacity-50' : 'border-gray-600 hover:border-neon-blue hover:bg-cyber-dark/50 cursor-pointer'}
              `}
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
                disabled={isLoading}
              />
              
              {mediaFiles.length === 0 ? (
                <>
                  <Upload className="w-12 h-12 text-gray-500 mb-4 mx-auto" />
                  <p className="text-lg font-medium text-gray-300">Drop Evidence Files Here</p>
                  <p className="text-sm text-gray-500 mt-2">Support: Images (.jpg, .png) & Video (.mp4, .webm)</p>
                </>
              ) : (
                 <div className="grid grid-cols-2 gap-4 w-full">
                    {mediaFiles.map((media, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-700 bg-black aspect-video">
                        {media.type === 'video' ? (
                          <video src={media.previewUrl} className="w-full h-full object-cover opacity-80" />
                        ) : (
                          <img src={media.previewUrl} alt="evidence" className="w-full h-full object-cover opacity-80" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] font-mono text-gray-300 uppercase">
                           {media.type}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add more button */}
                    <button 
                      className="aspect-video flex flex-col items-center justify-center border border-gray-700 rounded-lg hover:bg-cyber-dark/50 transition-colors"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <Upload className="w-6 h-6 text-gray-500 mb-2" />
                      <span className="text-xs text-gray-500">Add File</span>
                    </button>
                 </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto">
               <button 
                 onClick={handleAnalyze}
                 disabled={mediaFiles.length === 0 || isLoading}
                 className={`w-full py-4 rounded-lg font-bold text-lg tracking-widest uppercase transition-all flex items-center justify-center
                   ${mediaFiles.length > 0 && !isLoading
                     ? 'bg-neon-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                     : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                 `}
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="w-6 h-6 animate-spin mr-3" />
                     Analyzing Data...
                   </>
                 ) : (
                   <>
                     <Play className="w-6 h-6 mr-3 fill-current" />
                     Initialize Analysis
                   </>
                 )}
               </button>
               
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="w-1/2 p-6 bg-cyber-black/80 flex flex-col relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-20"></div>
             
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center">
               <span className="w-2 h-2 bg-neon-cyan rounded-full mr-2 animate-pulse"></span>
               Analysis Logs
             </h3>

             <div className="flex-1 rounded-xl bg-cyber-dark/30 border border-cyber-light p-6 overflow-hidden relative">
               {!analysisResult && !isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <Cpu className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-mono text-sm">Awaiting input data...</p>
                 </div>
               )}

               {isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-cyber-black/50 backdrop-blur-sm">
                    <div className="flex space-x-1 mb-4">
                      <div className="w-1 h-8 bg-neon-blue animate-[wave_1s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-8 bg-neon-blue animate-[wave_1s_ease-in-out_0.1s_infinite]"></div>
                      <div className="w-1 h-8 bg-neon-blue animate-[wave_1s_ease-in-out_0.2s_infinite]"></div>
                      <div className="w-1 h-8 bg-neon-blue animate-[wave_1s_ease-in-out_0.3s_infinite]"></div>
                      <div className="w-1 h-8 bg-neon-blue animate-[wave_1s_ease-in-out_0.4s_infinite]"></div>
                    </div>
                    <p className="font-mono text-neon-blue text-sm animate-pulse">PROCESSING NEURAL VECTORS</p>
                 </div>
               )}

               {analysisResult && (
                 <ResultDisplay text={analysisResult} />
               )}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;