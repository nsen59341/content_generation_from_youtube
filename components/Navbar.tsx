
import React from 'react';
import { AppState } from '../types';

interface NavbarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeState, onNavigate }) => {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-xl px-2 py-2 glass-panel rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10 transition-all duration-500">
      <div className="flex items-center gap-4 pl-5">
        <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center text-lg font-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Ω
        </div>
        <span className="text-[10px] font-mono font-black tracking-[0.2em] hidden sm:block text-white/80">ULTIMATE_REPURPOSER</span>
      </div>
      
      <div className="flex items-center gap-1.5 pr-1.5">
        <button 
          onClick={() => onNavigate(AppState.HOME)}
          className={`px-7 py-2.5 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            activeState === AppState.HOME || activeState === AppState.TRANSCRIPT_FETCH 
            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          NEW
        </button>
        <button 
          onClick={() => onNavigate(AppState.HISTORY)}
          className={`px-7 py-2.5 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            activeState === AppState.HISTORY 
            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          ARCHIVE
        </button>
      </div>
    </nav>
  );
};
