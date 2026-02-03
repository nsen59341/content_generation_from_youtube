
import React, { useState, useEffect } from 'react';
import { AppState, VideoMetadata, Platform, GeneratedContent, SessionRecord, GeneratedContentRecord } from './types';
import { db } from './db';
import { getTranscript } from './services/supadataService';
import { 
  generateImpactSummary, 
  generateSocialContent, 
  generateImagePrompt,
  generateImage,
  generateVideo
} from './services/geminiService';
import { Layout } from './components/Layout';
import { VideoCard } from './components/VideoCard';
import { PlatformSelector } from './components/PlatformSelector';
import { ContentDisplay } from './components/ContentDisplay';
import { MediaGenerator } from './components/MediaGenerator';
import { AudioTranscriber } from './components/AudioTranscriber';
import { HistoryView } from './components/HistoryView';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  
  // Active session data
  const [currentSession, setCurrentSession] = useState<SessionRecord | null>(null);
  const [sessionContents, setSessionContents] = useState<GeneratedContentRecord[]>([]);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setAppState(AppState.TRANSCRIPT_FETCH);
    
    try {
      const { transcript, metadata } = await getTranscript(url);
      
      const newSession: SessionRecord = {
        title: metadata.title,
        duration: metadata.duration,
        summary: '',
        url: url,
        thumbnail: metadata.thumbnail,
        transcript: transcript,
        timestamp: Date.now()
      };

      const id = await db.sessions.add(newSession);
      setCurrentSession({ ...newSession, id });
      setSessionContents([]);
      setAppState(AppState.SESSION_VIEW);
    } catch (error: any) {
      console.error(error);
      alert(`Transcription Error: ${error.message}`);
      setAppState(AppState.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentSession?.id || !currentSession.transcript) return;
    
    setIsLoading(true);
    try {
      const summary = await generateImpactSummary(currentSession.transcript);
      await db.sessions.update(currentSession.id, { summary });
      setCurrentSession(prev => prev ? { ...prev, summary } : null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (id: number) => {
    const session = await db.sessions.get(id);
    const contents = await db.generatedContents.where('sessionId').equals(id).reverse().sortBy('timestamp');
    if (session) {
      setCurrentSession(session);
      setSessionContents(contents);
      setAppState(AppState.SESSION_VIEW);
    }
  };

  const handlePlatformSelect = async (platform: Platform) => {
    if (!currentSession?.id) return;
    setActivePlatform(platform);
    
    const isMedia = platform === Platform.IMAGE || platform === Platform.VIDEO;
    if (isMedia) setIsMediaLoading(true);
    else setIsLoading(true);

    try {
      let content = "";
      let mediaUrl = "";
      
      if (platform === Platform.IMAGE) {
        const prompt = await generateImagePrompt(currentSession.transcript);
        content = `Prompt used: ${prompt}`;
        mediaUrl = await generateImage(prompt);
      } else if (platform === Platform.VIDEO) {
        const prompt = `Futuristic visualization of: ${currentSession.summary || currentSession.title}. Professional color grading, volumetric lighting, and smooth motion.`;
        content = "Viral asset successfully rendered.";
        mediaUrl = await generateVideo(prompt);
      } else {
        content = await generateSocialContent(platform, currentSession.transcript, currentSession.title);
      }

      const newRecord: GeneratedContentRecord = {
        sessionId: currentSession.id,
        platform,
        content,
        mediaUrl,
        timestamp: Date.now()
      };

      const contentId = await db.generatedContents.add(newRecord);
      setSessionContents(prev => [{ ...newRecord, id: contentId }, ...prev]);
    } catch (error) {
      console.error(error);
      alert(`Error generating ${platform} content.`);
    } finally {
      setIsLoading(false);
      setIsMediaLoading(false);
      setActivePlatform(null);
    }
  };

  return (
    <Layout>
      <Navbar activeState={appState} onNavigate={setAppState} />
      
      <div className="max-w-5xl mx-auto pt-24 pb-20 px-4">
        
        {appState === AppState.HOME && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <header className="text-center">
              <h1 className="text-6xl md:text-8xl font-display font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 tracking-tight">
                CONTENT OS
              </h1>
              <p className="text-blue-400 text-lg md:text-xl font-mono tracking-widest uppercase glow-text">
                Universal Repurposing Engine
              </p>
            </header>

            <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2.6rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <form onSubmit={handleUrlSubmit} className="space-y-8 relative">
                <div>
                  <label className="block text-xs font-mono font-bold text-blue-500 mb-4 tracking-[0.3em] uppercase">Target Intelligence (YouTube URL)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 bg-gray-950/50 border border-slate-800 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-600 transition-all outline-none text-white text-lg font-light placeholder:text-slate-700"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-white text-black hover:bg-blue-500 hover:text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isLoading ? "PROBING..." : "ANALYZE"}
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-12 pt-10 border-t border-slate-800/50">
                <AudioTranscriber />
              </div>
            </div>
          </div>
        )}

        {appState === AppState.TRANSCRIPT_FETCH && (
          <div className="text-center py-40 animate-pulse">
            <div className="w-24 h-24 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-10"></div>
            <p className="text-2xl font-display italic text-slate-400 tracking-wide">Decoding semantic structures from Supadata...</p>
          </div>
        )}

        {appState === AppState.HISTORY && (
          <HistoryView onSelect={loadSession} />
        )}

        {appState === AppState.SESSION_VIEW && currentSession && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
            <VideoCard 
              metadata={currentSession} 
              onNext={handleGenerateSummary} 
              showSummary={!!currentSession.summary} 
              summary={currentSession.summary}
            />

            <div className="border-t border-slate-800 pt-12">
              <PlatformSelector onSelect={handlePlatformSelect} activePlatform={activePlatform} />
            </div>

            {isMediaLoading && (
              <MediaGenerator type={activePlatform === Platform.VIDEO ? 'video' : 'image'} />
            )}

            {isLoading && !isMediaLoading && (
              <div className="text-center py-16 glass-panel rounded-3xl border-dashed border-slate-700">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Synthesizing platform narrative...</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-10 pb-32">
              {sessionContents.map((record) => (
                <ContentDisplay key={record.id} content={record} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
