
import React from 'react';
import { AppState } from '../types';

interface NavbarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeState, onNavigate }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl px-2 py-2 glass-panel rounded-full shadow-2xl flex items-center justify-between border border-white/5">
      <div className="flex items-center gap-4 pl-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-sm font-black">R</div>
        <span className="text-xs font-mono font-bold tracking-tighter hidden sm:block">REPURPOSER.OS</span>
      </div>
      
      <div className="flex items-center gap-1 pr-1">
        <button 
          onClick={() => onNavigate(AppState.HOME)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            activeState === AppState.HOME || activeState === AppState.TRANSCRIPT_FETCH 
            ? 'bg-white text-black' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          NEW
        </button>
        <button 
          onClick={() => onNavigate(AppState.HISTORY)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
            activeState === AppState.HISTORY 
            ? 'bg-white text-black' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          HISTORY
        </button>
      </div>
    </nav>
  );
};
