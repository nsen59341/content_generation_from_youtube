
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
    <div className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-1000 group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="flex flex-col lg:flex-row relative z-10">
        <div className="w-full lg:w-2/5 relative overflow-hidden">
          <img 
            src={metadata.thumbnail} 
            alt={metadata.title} 
            className="w-full h-full object-cover aspect-video lg:aspect-auto min-h-[350px] scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r"></div>
        </div>
        <div className="p-12 flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8">
            <span className="bg-blue-600/10 text-blue-400 text-[9px] font-mono font-bold uppercase tracking-[0.4em] px-5 py-2 rounded-full border border-blue-500/30 glow-text">
              DATA_PROBE::INITIALIZED
            </span>
            <span className="text-slate-500 text-[10px] font-mono tracking-widest">{metadata.duration}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-white mb-10 leading-[1.1] tracking-tight group-hover:glow-text transition-all">
            {metadata.title}
          </h2>
          
          {!showSummary ? (
            <button 
              onClick={onNext}
              className="w-full bg-white hover:bg-blue-600 text-black hover:text-white font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 group/btn shadow-xl hover:shadow-blue-500/20"
            >
              <span className="tracking-[0.2em] text-sm">LAUNCH IMPACT ANALYSIS</span>
              <span className="group-hover/btn:translate-x-2 transition-transform">&gt;&gt;&gt;</span>
            </button>
          ) : (
            <div className="bg-slate-950/60 p-10 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-right-8 duration-1000 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="text-blue-500 text-[9px] font-mono font-bold uppercase mb-6 tracking-[0.4em]">SYNOPSIS_OUTPUT</h3>
              <p className="text-slate-200 leading-[1.8] italic text-xl lg:text-2xl font-light">
                "{summary}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
