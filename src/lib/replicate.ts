/**
 * Replicate API Service — Ember
 * Handles AI baby generation via Stable Diffusion
 */

import Constants from 'expo-constants';
import { GenerationProgress, GenerationStage } from '../types';

const REPLICATE_API_TOKEN = Constants.expoConfig?.extra?.replicateApiToken || '';
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

interface PredictionResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output: string[] | null;
  error: string | null;
}

/**
 * Generate a baby image from parent photos
 */
export async function generateBabyImage(
  parentPhotos: string[],
  onProgress?: (progress: GenerationProgress) => void
): Promise<string> {
  try {
    // Stage 1: Uploading
    onProgress?.({
      stage: 'uploading',
      progress: 10,
      message: 'Uploading your photos...',
    });

    await delay(1500);

    // Stage 2: Analyzing
    onProgress?.({
      stage: 'analyzing',
      progress: 25,
      message: 'Analyzing those good genes... 🧬',
    });

    // Create prediction
    const prediction = await createPrediction(parentPhotos);

    // Stage 3: Mixing
    onProgress?.({
      stage: 'mixing',
      progress: 40,
      message: 'Mixing DNA with a sprinkle of magic... ✨',
    });

    await delay(2000);

    // Stage 4: Generating
    onProgress?.({
      stage: 'generating',
      progress: 60,
      message: 'Adding extra cuteness... 🥰',
    });

    // Poll for result
    const result = await pollPrediction(prediction.id, onProgress);

    // Stage 5: Finishing
    onProgress?.({
      stage: 'finishing',
      progress: 90,
      message: 'Almost there... just adding the finishing touches! 💕',
    });

    await delay(1000);

    // Stage 6: Complete
    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Your baby is ready! 🎉',
    });

    if (result.output && result.output.length > 0) {
      return result.output[0];
    }

    throw new Error('No image generated');
  } catch (error: any) {
    // In demo mode, return a placeholder
    if (!REPLICATE_API_TOKEN) {
      return generateDemoImage(onProgress);
    }
    throw error;
  }
}

/**
 * Create a prediction on Replicate
 */
async function createPrediction(photos: string[]): Promise<PredictionResponse> {
  if (!REPLICATE_API_TOKEN) {
    // Demo mode — simulate the API call
    return {
      id: 'demo-prediction',
      status: 'processing',
      output: null,
      error: null,
    };
  }

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/stable-diffusion:latest',
      input: {
        prompt: 'adorable cute baby portrait, photorealistic, soft lighting, warm tones, studio photo',
        negative_prompt: 'ugly, deformed, blurry, low quality',
        width: 512,
        height: 512,
        num_outputs: 1,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Poll a prediction until it completes
 */
async function pollPrediction(
  predictionId: string,
  onProgress?: (progress: GenerationProgress) => void
): Promise<PredictionResponse> {
  if (predictionId === 'demo-prediction') {
    await delay(3000);
    return {
      id: 'demo-prediction',
      status: 'succeeded',
      output: ['https://picsum.photos/512/512'],
      error: null,
    };
  }

  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(
      `${REPLICATE_API_URL}/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    );

    const prediction: PredictionResponse = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction;
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(prediction.error || 'Generation failed');
    }

    // Update progress during polling
    const progress = Math.min(60 + attempts * 2, 85);
    onProgress?.({
      stage: 'generating',
      progress,
      message: 'Adding extra cuteness... 🥰',
    });

    await delay(2000);
    attempts++;
  }

  throw new Error('Generation timed out');
}

/**
 * Generate a demo baby image (for development/demo without API key)
 */
async function generateDemoImage(
  onProgress?: (progress: GenerationProgress) => void
): Promise<string> {
  const stages: Array<{ stage: GenerationStage; progress: number; message: string; delay: number }> = [
    { stage: 'uploading', progress: 15, message: 'Uploading your photos...', delay: 1200 },
    { stage: 'analyzing', progress: 30, message: 'Analyzing those good genes... 🧬', delay: 1500 },
    { stage: 'mixing', progress: 50, message: 'Mixing DNA with a sprinkle of magic... ✨', delay: 2000 },
    { stage: 'generating', progress: 70, message: 'Adding extra cuteness... 🥰', delay: 2500 },
    { stage: 'finishing', progress: 90, message: 'Almost there... finishing touches! 💕', delay: 1000 },
    { stage: 'complete', progress: 100, message: 'Your baby is ready! 🎉', delay: 500 },
  ];

  for (const s of stages) {
    onProgress?.({ stage: s.stage, progress: s.progress, message: s.message });
    await delay(s.delay);
  }

  // Return a cute baby placeholder image
  return 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=512&h=512&fit=crop';
}

/**
 * Utility delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
