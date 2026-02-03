
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Platform } from "../types";

// Helper to get fresh AI instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImpactSummary(transcript: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this transcript, provide a 3-sentence "Impact Summary" that highlights the core value proposition: ${transcript}`,
    config: {
      temperature: 0.7,
    },
  });
  return response.text || "Summary unavailable.";
}

export async function generateSocialContent(platform: Platform, transcript: string, videoTitle: string): Promise<string> {
  const ai = getAI();
  let systemInstruction = "";

  switch (platform) {
    case Platform.LINKEDIN:
      systemInstruction = "You are an executive strategist. Focus on 'Executive Insight.' Use a scroll-stopping hook, 3 bulleted 'golden nuggets,' and a conversational closing. Use 1.5x line spacing for readability. Be professional and authoritative.";
      break;
    case Platform.INSTAGRAM_REEL:
      systemInstruction = "Write a 60-second script for an Instagram Reel. Structure: 0-3s (The Hook), 3-50s (Value/Visual instructions), 50-60s (CTA). Focus on fast pacing and high energy.";
      break;
    case Platform.TWEET:
      systemInstruction = "Create a 5-tweet thread. Tweet 1 is a bold claim. Tweets 2-4 provide evidence from the content. Tweet 5 is a Call to Action. Use punchy, short sentences.";
      break;
    case Platform.EMAIL:
      systemInstruction = "Write an email in 'The Curiosity Gap' style. Subject lines must demand a click. Focus on the transformation/lesson from the video. Keep it personal and engaging.";
      break;
    case Platform.FACEBOOK:
      systemInstruction = "Write an engaging Facebook post that encourages community discussion. Focus on storytelling and emotional connection to the video's content.";
      break;
    default:
      systemInstruction = "Repurpose this content into a viral social media post.";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-end ${platform} post based on this YouTube video title: "${videoTitle}" and transcript: "${transcript}"`,
    config: {
      systemInstruction,
      temperature: 0.8,
    },
  });

  return response.text || "Content generation failed.";
}

export async function generateImagePrompt(transcript: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: `Create a high-fidelity image prompt for Gemini 2.5 Flash Image based on this content: "${transcript}". Focus on cinematic lighting, 16:9 aspect ratio, and consistent high-end branding. Return only the prompt.`,
  });
  return response.text || "A cinematic representation of digital content strategy.";
}

export async function generateImage(prompt: string, model: string = 'gemini-2.5-flash-image', size: string = '1K'): Promise<string> {
  const ai = getAI();
  
  if (model === 'gemini-3-pro-image-preview') {
    // Check for API key selection for Pro Image
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
    }
  }

  const response = await ai.models.generateContent({
    model: model as any,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size as any,
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from model");
}

export async function editImage(base64Image: string, editPrompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: editPrompt }
      ]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image edit failed");
}

export async function generateVideo(prompt: string): Promise<string> {
  const ai = getAI();
  
  // Mandatory key selection for Veo
  const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
  if (!hasKey) {
    await (window as any).aistudio?.openSelectKey();
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
}

// Low latency fast response
export async function fastAnalyze(prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: prompt,
  });
  return response.text || "";
}

// Transcription from Audio (Mic)
export async function transcribeAudio(base64Audio: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } },
        { text: "Transcribe this audio exactly as spoken." }
      ]
    }
  });
  return response.text || "";
}
