/**
 * Baby Engine — Pure Functions (no Supabase dependency)
 * Used by mock mode and anywhere stats need to be calculated offline.
 */

import {
  Baby,
  BabyStats,
  BabyMood,
} from '../types';
import {
  STAT_DECAY,
  MOOD_THRESHOLDS,
  MOOD_EMOJIS,
  HAPPINESS_WEIGHTS,
} from '../constants';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getMood(happiness: number): BabyMood {
  if (happiness >= MOOD_THRESHOLDS.happy) return 'happy';
  if (happiness >= MOOD_THRESHOLDS.okay) return 'okay';
  if (happiness >= MOOD_THRESHOLDS.sad) return 'sad';
  return 'crying';
}

export function calculateCurrentStats(baby: Baby): BabyStats {
  const now = new Date();
  const lastAction = new Date(baby.last_action_at);
  const hoursElapsed = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60);

  const hunger = clamp(baby.hunger - STAT_DECAY.hunger * hoursElapsed, 0, 100);
  const cleanliness = clamp(baby.cleanliness - STAT_DECAY.cleanliness * hoursElapsed, 0, 100);
  const fun = clamp(baby.fun - STAT_DECAY.fun * hoursElapsed, 0, 100);

  const happiness = Math.round(
    hunger * HAPPINESS_WEIGHTS.hunger +
    cleanliness * HAPPINESS_WEIGHTS.cleanliness +
    fun * HAPPINESS_WEIGHTS.fun
  );

  const mood = getMood(happiness);

  return {
    happiness: clamp(happiness, 0, 100),
    hunger: Math.round(hunger),
    cleanliness: Math.round(cleanliness),
    fun: Math.round(fun),
    mood,
    moodEmoji: MOOD_EMOJIS[mood],
  };
}
