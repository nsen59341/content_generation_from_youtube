
import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { SessionRecord } from '../types';

interface HistoryViewProps {
  onSelect: (id: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadHistory = async () => {
      const records = await db.sessions.reverse().toArray();
      setHistory(records);

      const countMap: Record<number, number> = {};
      for (const record of records) {
        if (record.id) {
          countMap[record.id] = await db.generatedContents.where('sessionId').equals(record.id).count();
        }
      }
      setCounts(countMap);
    };
    loadHistory();
  }, []);

  const deleteSession = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Permanently archive this session?")) {
      await db.sessions.delete(id);
      await db.generatedContents.where('sessionId').equals(id).delete();
      setHistory(prev => prev.filter(s => s.id !== id));
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-40 glass-panel rounded-[3rem]">
        <div className="text-5xl mb-6 opacity-20">🗄️</div>
        <h3 className="text-2xl font-display text-slate-500">Archive is currently empty.</h3>
        <p className="text-slate-600 font-mono text-sm mt-2">Initialize a new content probe to start your history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-white">RECORDS</h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Intelligence Database History</p>
        </div>
        <span className="text-slate-500 font-mono text-xs">{history.length} Sessions Detected</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {history.map((session) => (
          <div 
            key={session.id}
            onClick={() => session.id && onSelect(session.id)}
            className="glass-panel rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer glow-hover relative"
          >
            <div className="relative aspect-video">
              <img src={session.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={session.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="bg-black/50 backdrop-blur-md text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 uppercase">{session.duration}</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">{counts[session.id!] || 0} Assets</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-100 line-clamp-1 mb-2">{session.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{new Date(session.timestamp).toLocaleDateString()}</span>
                <button 
                  onClick={(e) => session.id && deleteSession(e, session.id)}
                  className="text-slate-700 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
