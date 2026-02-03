
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Fetching core thematic elements...",
  "Orchestrating visual assets with Gemini...",
  "Applying cinematic lighting and textures...",
  "Simulating physics and environmental depth...",
  "Refining multi-platform brand consistency...",
  "Finalizing high-end production render...",
  "Optimizing for viral distribution..."
];

export const MediaGenerator: React.FC<{ type: 'video' | 'image' }> = ({ type }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-900/40 rounded-3xl border border-gray-800 border-dashed animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {type === 'video' ? '🎞️' : '🎨'}
        </div>
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-2">
        {type === 'video' ? 'Rendering Cinematic Video' : 'Generating High-Fidelity Asset'}
      </h3>
      <p className="text-blue-400 text-sm font-medium animate-pulse">
        {MESSAGES[index]}
      </p>
      <p className="text-gray-500 text-[10px] mt-6 uppercase tracking-[0.2em]">
        {type === 'video' ? 'Veo 3.1 AI Engine Active' : 'Nano Banana Core Active'}
      </p>
    </div>
  );
};
