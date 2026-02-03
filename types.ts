
export enum AppState {
  HOME = 'HOME',
  TRANSCRIPT_FETCH = 'TRANSCRIPT_FETCH',
  SESSION_VIEW = 'SESSION_VIEW',
  HISTORY = 'HISTORY'
}

export enum Platform {
  LINKEDIN = 'LinkedIn',
  INSTAGRAM_POST = 'Instagram Post',
  INSTAGRAM_REEL = 'Instagram Reel',
  FACEBOOK = 'Facebook',
  TWEET = 'Tweet Thread',
  EMAIL = 'Email',
  IMAGE = 'Image (Nano Banana)',
  VIDEO = 'Video (Veo 3.1)'
}

export interface VideoMetadata {
  title: string;
  duration: string;
  summary: string;
  url: string;
  thumbnail?: string;
}

export interface SessionRecord extends VideoMetadata {
  id?: number;
  transcript: string;
  timestamp: number;
}

export interface GeneratedContentRecord {
  id?: number;
  sessionId: number;
  platform: Platform;
  content: string;
  mediaUrl?: string;
  timestamp: number;
}

export interface GeneratedContent {
  platform: Platform;
  content: string;
  mediaUrl?: string;
}

export interface TranscriptPart {
  text: string;
  start: number;
  duration: number;
}
