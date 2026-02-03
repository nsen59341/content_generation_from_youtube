
import React, { useState } from 'react';
import { GeneratedContentRecord } from '../types';
import { editImage } from '../services/geminiService';
import { db } from '../db';

interface ContentDisplayProps {
  content: GeneratedContentRecord;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content }) => {
  const [currentMedia, setCurrentMedia] = useState(content.mediaUrl);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content);
    alert('Narrative copied to system clipboard.');
  };

  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt || !currentMedia || !content.id) return;
    setIsEditing(true);
    try {
      const newImage = await editImage(currentMedia, editPrompt);
      setCurrentMedia(newImage);
      // Persist the edit
      await db.generatedContents.update(content.id, { mediaUrl: newImage });
      setEditPrompt('');
    } catch (error) {
      console.error(error);
      alert("Nano Banana refinement failed.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-8 duration-700 glow-hover">
      <div className="bg-slate-900/40 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
            {content.platform.includes('Image') ? '🎨' : content.platform.includes('Video') ? '🎞️' : '📝'}
          </span>
          <div>
            <span className="block font-bold text-white text-sm">{content.platform}</span>
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {new Date(content.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="text-[10px] font-mono font-bold bg-white text-black hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full transition-all uppercase"
        >
          Copy Script
        </button>
      </div>
      <div className="p-10">
        {currentMedia && (
          <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl border border-white/5 group relative">
             {content.platform.includes('Video') ? (
               <video src={currentMedia} controls className="w-full aspect-video object-cover" />
             ) : (
               <>
                 <img src={currentMedia} alt="Generated Content" className="w-full h-auto object-cover" />
                 <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-8 backdrop-blur-md">
                   <form onSubmit={handleEditImage} className="w-full max-w-sm space-y-6">
                      <div className="text-center">
                        <p className="text-white text-lg font-display font-bold mb-2">Refine Visual Data</p>
                        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Nano Banana Refinement Module</p>
                      </div>
                      <input 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="e.g., 'Apply synthwave colors'"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-600 font-light"
                      />
                      <button 
                        type="submit"
                        disabled={isEditing}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-black transition-all hover:bg-blue-500 disabled:opacity-50 uppercase text-xs tracking-widest"
                      >
                        {isEditing ? 'SYNTHESIZING...' : 'APPLY REFINEMENT'}
                      </button>
                   </form>
                 </div>
               </>
             )}
          </div>
        )}
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-slate-300 leading-[1.9] font-light text-lg">
            {content.content}
          </p>
        </div>
      </div>
    </div>
  );
};
