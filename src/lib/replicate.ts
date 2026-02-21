/**
 * Replicate API Service — Ember V2
 * Real AI baby generation via smoosh-sh/baby-mystic (4.2M runs on Replicate)
 * Model: Realistic Vision v5.1 — blends two parent photos into a realistic baby
 */

import Constants from 'expo-constants';
import { GenerationProgress, GenerationStage } from '../types';

const REPLICATE_API_TOKEN = Constants.expoConfig?.extra?.replicateApiToken || '';
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

// The best baby generation model on Replicate — 4.2M runs, $0.0055/run, ~6s generation
const BABY_MYSTIC_VERSION = 'ba5ab694a9df055fa469e55eeab162cc288039da0abd8b19d956980cc3b49f6d';

// Emotional loading messages that prime the user for attachment DURING the wait
export const GENERATION_MESSAGES_V2: Record<string, string> = {
  uploading: 'Uploading your photos... 📸',
  analyzing: 'Combining the best of both of you... 👨‍👩‍👧',
  mixing: 'Sprinkling in a little magic ✨',
  generating: 'Adding those perfect little fingers... 🤞',
  finishing: 'Almost ready to meet the world... 👶',
  complete: 'Your baby is here! 🎉',
};

interface PredictionResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output: string[] | string | null;
  error: string | null;
  urls?: {
    get: string;
    cancel: string;
  };
}

/**
 * Generate a baby image from parent photos using smoosh-sh/baby-mystic
 * Takes 1-2 parent photos and returns a URL to the generated baby image
 */
export async function generateBabyImage(
  parentPhotos: string[],
  onProgress?: (progress: GenerationProgress) => void
): Promise<string> {
  // In demo mode (no API key), use the theatrical demo flow
  if (!REPLICATE_API_TOKEN) {
    return generateDemoImage(onProgress);
  }

  try {
    // Stage 1: Uploading
    onProgress?.({
      stage: 'uploading',
      progress: 10,
      message: GENERATION_MESSAGES_V2.uploading,
    });

    await delay(1200);

    // Stage 2: Analyzing
    onProgress?.({
      stage: 'analyzing',
      progress: 25,
      message: GENERATION_MESSAGES_V2.analyzing,
    });

    // Create the prediction with baby-mystic
    const prediction = await createBabyMysticPrediction(parentPhotos);

    // Stage 3: Mixing magic
    onProgress?.({
      stage: 'mixing',
      progress: 40,
      message: GENERATION_MESSAGES_V2.mixing,
    });

    // Stage 4: Poll for result (the model takes ~6-8s)
    const result = await pollPrediction(prediction.id, onProgress);

    // Stage 5: Finishing touches
    onProgress?.({
      stage: 'finishing',
      progress: 90,
      message: GENERATION_MESSAGES_V2.finishing,
    });

    await delay(1000);

    // Stage 6: Complete!
    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: GENERATION_MESSAGES_V2.complete,
    });

    // baby-mystic returns a single URL string or array
    if (result.output) {
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      if (outputUrl && typeof outputUrl === 'string') {
        return outputUrl;
      }
    }

    throw new Error('No image generated from baby-mystic');
  } catch (error: any) {
    console.error('Baby generation error:', error);
    // Graceful fallback to demo mode on any API error
    console.warn('Falling back to demo mode due to API error');
    return generateDemoImage(onProgress);
  }
}

/**
 * Create a baby-mystic prediction on Replicate
 * Model inputs: image (mom photo), image2 (dad photo), gender
 */
async function createBabyMysticPrediction(photos: string[]): Promise<PredictionResponse> {
  const [photo1, photo2] = photos;

  // baby-mystic uses: image (woman/mom), image2 (man/dad), gender
  // If only one photo provided, use it for both parents
  const input: Record<string, string | number> = {
    image: photo1,        // Primary parent photo (mom)
    image2: photo2 || photo1, // Second parent (dad), fallback to same photo
    steps: 25,            // Default quality/speed balance
    width: 512,
    height: 728,          // Portrait orientation for baby face
  };

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: BABY_MYSTIC_VERSION,
      input,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Poll a prediction until it completes
 * baby-mystic typically completes in 6-8 seconds
 */
async function pollPrediction(
  predictionId: string,
  onProgress?: (progress: GenerationProgress) => void
): Promise<PredictionResponse> {
  const maxAttempts = 60; // 2 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    await delay(2000); // Poll every 2 seconds

    const response = await fetch(
      `${REPLICATE_API_URL}/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Poll error: ${response.status}`);
    }

    const prediction: PredictionResponse = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction;
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(prediction.error || 'Generation failed or was canceled');
    }

    // Slowly advance the progress bar during generation (40-85%)
    const progress = Math.min(40 + attempts * 5, 85);
    onProgress?.({
      stage: 'generating',
      progress,
      message: GENERATION_MESSAGES_V2.generating,
    });

    attempts++;
  }

  throw new Error('Generation timed out after 2 minutes');
}

/**
 * Demo mode — theatrical simulation of generation with emotional copy
 * Makes the wait feel meaningful even without an API key
 */
async function generateDemoImage(
  onProgress?: (progress: GenerationProgress) => void
): Promise<string> {
  const stages: Array<{
    stage: GenerationStage;
    progress: number;
    message: string;
    delayMs: number;
  }> = [
    {
      stage: 'uploading',
      progress: 15,
      message: GENERATION_MESSAGES_V2.uploading,
      delayMs: 1200,
    },
    {
      stage: 'analyzing',
      progress: 30,
      message: GENERATION_MESSAGES_V2.analyzing,
      delayMs: 2000,
    },
    {
      stage: 'mixing',
      progress: 50,
      message: GENERATION_MESSAGES_V2.mixing,
      delayMs: 2500,
    },
    {
      stage: 'generating',
      progress: 70,
      message: GENERATION_MESSAGES_V2.generating,
      delayMs: 2000,
    },
    {
      stage: 'finishing',
      progress: 90,
      message: GENERATION_MESSAGES_V2.finishing,
      delayMs: 1500,
    },
    {
      stage: 'complete',
      progress: 100,
      message: GENERATION_MESSAGES_V2.complete,
      delayMs: 500,
    },
  ];

  for (const s of stages) {
    onProgress?.({ stage: s.stage, progress: s.progress, message: s.message });
    await delay(s.delayMs);
  }

  // Warm, sweet baby stock photo for demo
  return 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=512&h=728&fit=crop&crop=face';
}

/**
 * Utility delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Alias for backwards compatibility with existing screens
 */
export const generateBaby = generateBabyImage;
