
import React from 'react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
  activePlatform: Platform | null;
}

const platforms = [
  { id: Platform.LINKEDIN, icon: '💼', label: 'LinkedIn', desc: 'Executive Insight' },
  { id: Platform.INSTAGRAM_POST, icon: '📸', label: 'IG Post', desc: 'Visual Storytelling' },
  { id: Platform.INSTAGRAM_REEL, icon: '🎥', label: 'IG Reel', desc: 'High Energy Script' },
  { id: Platform.TWEET, icon: '🐦', label: 'X Thread', desc: 'Viral Claim Chain' },
  { id: Platform.EMAIL, icon: '✉️', label: 'Email', desc: 'The Curiosity Gap' },
  { id: Platform.FACEBOOK, icon: '👥', label: 'Facebook', desc: 'Community Story' },
  { id: Platform.IMAGE, icon: '🎨', label: 'AI Image', desc: 'Nano Banana' },
  { id: Platform.VIDEO, icon: '🎞️', label: 'AI Video', desc: 'Veo 3.1 Animation' },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect, activePlatform }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-center text-gray-400 font-medium text-sm tracking-[0.2em] uppercase">Which platform are we dominating today?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
              activePlatform === p.id 
              ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50' 
              : 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
            }`}
          >
            <span className="text-3xl mb-3">{p.icon}</span>
            <span className="font-bold text-white text-sm">{p.label}</span>
            <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{p.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
