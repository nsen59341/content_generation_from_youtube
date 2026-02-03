
import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';

export const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          try {
            const text = await transcribeAudio(base64Audio);
            setTranscription(text);
          } catch (err) {
            console.error(err);
            alert("Transcription failed.");
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white font-bold">Audio Thought Collector</h4>
          <p className="text-xs text-gray-500">Have a rough idea? Speak it, we'll transcribe it for the repurposer.</p>
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-400 py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          Transcribing with Gemini 3 Flash...
        </div>
      )}

      {transcription && (
        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-sm text-gray-300 italic">"{transcription}"</p>
          <button 
            onClick={() => setTranscription('')}
            className="text-[10px] text-gray-500 hover:text-white mt-2 uppercase tracking-widest"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
