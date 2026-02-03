
import { TranscriptPart } from '../types';

const SUPADATA_API_BASE = 'https://api.supadata.ai/v1/youtube';

/**
 * Manually fetches and parses the .env file since standard browser 
 * environments do not populate process.env from local files.
 */
async function getApiKeyFromEnvFile(): Promise<string | null> {
  try {
    // Try to fetch the .env file from the root
    const response = await fetch('./.env');
    if (!response.ok) return null;
    
    const text = await response.text();
    // Look for the SUPADATA_API_KEY line
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('SUPADATA_API_KEY=')) {
        const key = trimmed.split('=')[1];
        return key ? key.trim() : null;
      }
    }
    return null;
  } catch (e) {
    console.warn('Could not read .env file directly:', e);
    return null;
  }
}

export async function getTranscript(videoUrl: string): Promise<{ transcript: string; metadata: any }> {
  const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) {
    throw new Error('Invalid YouTube URL format. Please provide a valid YouTube link.');
  }

  // 1. Check system process.env (injected by platform)
  // 2. Fallback to manually reading the .env file
  let apiKey = ((process.env as any).SUPADATA_API_KEY || '').trim();
  if (!apiKey || apiKey.includes('your_supadata_api_key')) {
    const fileKey = await getApiKeyFromEnvFile();
    if (fileKey) apiKey = fileKey;
  }

  // If a valid-looking key is found, attempt the real fetch
  if (apiKey && apiKey.length > 5 && !apiKey.includes('your_supadata_api_key')) {
    try {
      const apiUrl = `${SUPADATA_API_BASE}/transcript?url=${encodeURIComponent(videoUrl)}&text=true`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If 401 or 403, specifically tell the user their key is wrong
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed: Your Supadata API Key is invalid or has no credits.');
        }
        throw new Error(errorData.message || `Supadata API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      let finalTranscript = "";
      if (typeof data.content === 'string') {
        finalTranscript = data.content;
      } else if (Array.isArray(data.transcript)) {
        finalTranscript = data.transcript.map((part: any) => part.text).join(' ');
      } else if (typeof data.transcript === 'string') {
        finalTranscript = data.transcript;
      }

      if (!finalTranscript) {
        throw new Error("The API returned successfully, but no transcript content was found for this video.");
      }

      return {
        transcript: finalTranscript,
        metadata: {
          title: data.metadata?.title || "Analyzed Video",
          duration: typeof data.metadata?.duration === 'number' 
            ? `${Math.floor(data.metadata.duration / 60)}:${String(data.metadata.duration % 60).padStart(2, '0')}`
            : data.metadata?.duration || "00:00",
          thumbnail: data.metadata?.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      };
    } catch (error: any) {
      console.error('Real fetch failed:', error);
      // Re-throw so the UI shows the error instead of silently defaulting to mock
      throw error;
    }
  }

  // High-quality mock transcript fallback only if ABSOLUTELY no key is found
  console.warn('No Supadata API key detected in process.env or .env file. Using demo data.');
  const mockTranscript = `Welcome back to the channel. Today we're diving deep into the architecture of large language models and why the 'Ultimate Content Repurposer' is the next frontier for digital marketing. 

  The core problem most creators face is burnout. You spend 40 hours producing one high-quality video, and then it lives on only one platform. That is a massive waste of intellectual property. By leveraging the Gemini API, specifically the Flash and Pro models, we can extract the 'golden nuggets' from your transcript instantly. 

  Think about it: a 20-minute video contains enough insight for five LinkedIn posts, a Twitter thread, three Instagram Reels, and a deep-dive email newsletter. We use the Nano Banana model for high-fidelity thumbnails and Veo 3.1 for cinematic b-roll. 

  The key to viral content is not just the information, but the delivery. LinkedIn needs executive presence. Twitter needs punchy claims. Instagram needs high energy. Our tool automates the stylistic transformation while keeping your core message intact. This is how you 10x your output without 10x-ing your stress level. Let's look at how to set up the prompt orchestration...`;
  
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    transcript: mockTranscript,
    metadata: {
      title: "10x Your Reach: The Ultimate Content Repurposing Strategy (DEMO MODE)",
      duration: "18:22",
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  };
}
