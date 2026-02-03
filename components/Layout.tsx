
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#020617] text-slate-100">
      {/* Background Decor Layers */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* Deep Ambient Glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-float"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[15%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid System */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"></div>
        
        {/* Cyber Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b33_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      </div>
      
      <main className="relative z-10">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/5 py-4 px-8 flex justify-between items-center text-[9px] font-mono tracking-[0.4em] uppercase text-slate-500 z-50">
        <div className="flex items-center gap-6">
          <span className="text-blue-500/80">CONTENT.OS // REV 4.2</span>
          <span className="hidden sm:inline border-l border-slate-800 pl-6 text-slate-600">DEXIE.STORAGE: ENGAGED</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
            NEURAL_CORE: ACTIVE
          </span>
        </div>
      </footer>
    </div>
  );
};
