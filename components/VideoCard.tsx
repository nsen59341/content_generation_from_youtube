
import React from 'react';
import { VideoMetadata } from '../types';

interface VideoCardProps {
  metadata: VideoMetadata;
  onNext: () => void;
  showSummary: boolean;
  summary: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ metadata, onNext, showSummary, summary }) => {
  return (
    <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/5 relative">
          <img 
            src={metadata.thumbnail} 
            alt={metadata.title} 
            className="w-full h-full object-cover aspect-video lg:aspect-auto min-h-[300px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-transparent"></div>
        </div>
        <div className="p-10 flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-blue-600/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-blue-500/20">
              Session Metadata
            </span>
            <span className="text-slate-500 text-xs font-mono">{metadata.duration}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-extrabold text-white mb-8 leading-tight tracking-tight">
            {metadata.title}
          </h2>
          
          {!showSummary ? (
            <button 
              onClick={onNext}
              className="w-full bg-white hover:bg-blue-600 text-black hover:text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group"
            >
              INITIALIZE IMPACT ANALYSIS
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          ) : (
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 animate-in fade-in slide-in-from-right-4 duration-700">
              <h3 className="text-blue-500 text-[10px] font-mono font-bold uppercase mb-4 tracking-[0.3em]">Impact Summary</h3>
              <p className="text-slate-300 leading-relaxed italic text-lg lg:text-xl font-light">
                "{summary}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
