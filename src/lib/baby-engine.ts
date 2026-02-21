/**
 * Baby Engine — Ember
 * Core logic for baby stats, decay, actions, and mood
 */

import { supabase } from './supabase';
import {
  Baby,
  BabyStats,
  BabyMood,
  ActionType,
  ActionCooldown,
  BabyAction,
} from '../types';
import {
  STAT_DECAY,
  ACTION_EFFECTS,
  ACTION_COOLDOWNS,
  MOOD_THRESHOLDS,
  MOOD_EMOJIS,
  HAPPINESS_WEIGHTS,
} from '../constants';

// ===== Stats Calculation =====

/**
 * Calculate current baby stats with time-based decay
 */
export function calculateCurrentStats(baby: Baby): BabyStats {
  const now = new Date();
  const lastAction = new Date(baby.last_action_at);
  const hoursElapsed = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60);

  // Apply decay
  const hunger = clamp(baby.hunger - STAT_DECAY.hunger * hoursElapsed, 0, 100);
  const cleanliness = clamp(baby.cleanliness - STAT_DECAY.cleanliness * hoursElapsed, 0, 100);
  const fun = clamp(baby.fun - STAT_DECAY.fun * hoursElapsed, 0, 100);

  // Calculate happiness as weighted average
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

/**
 * Get baby mood from happiness level
 */
export function getMood(happiness: number): BabyMood {
  if (happiness >= MOOD_THRESHOLDS.happy) return 'happy';
  if (happiness >= MOOD_THRESHOLDS.okay) return 'okay';
  if (happiness >= MOOD_THRESHOLDS.sad) return 'sad';
  return 'crying';
}

// ===== Actions =====

/**
 * Perform an action on the baby
 */
export async function performAction(
  babyId: string,
  userId: string,
  actionType: ActionType
): Promise<{ success: boolean; error?: string; newStats?: BabyStats }> {
  try {
    // Get current baby
    const { data: baby, error: fetchError } = await supabase
      .from('babies')
      .select('*')
      .eq('id', babyId)
      .single();

    if (fetchError || !baby) {
      return { success: false, error: 'Baby not found' };
    }

    // Check cooldown
    const cooldownCheck = await checkCooldown(babyId, userId, actionType);
    if (!cooldownCheck.ready) {
      return {
        success: false,
        error: `Please wait ${cooldownCheck.remainingMinutes} more minutes 💕`,
      };
    }

    // Calculate current stats with decay
    const currentStats = calculateCurrentStats(baby);

    // Apply action effects
    const effects = ACTION_EFFECTS[actionType];
    const newHunger = clamp(currentStats.hunger + effects.hunger, 0, 100);
    const newCleanliness = clamp(currentStats.cleanliness + effects.cleanliness, 0, 100);
    const newFun = clamp(currentStats.fun + effects.fun, 0, 100);
    const newHappiness = clamp(
      currentStats.happiness + effects.happiness,
      0,
      100
    );

    // Update baby in database
    const { error: updateError } = await supabase
      .from('babies')
      .update({
        hunger: Math.round(newHunger),
        cleanliness: Math.round(newCleanliness),
        fun: Math.round(newFun),
        happiness: Math.round(newHappiness),
        last_action_at: new Date().toISOString(),
      })
      .eq('id', babyId);

    if (updateError) {
      return { success: false, error: 'Failed to update baby stats' };
    }

    // Log the action
    const { error: logError } = await supabase
      .from('actions')
      .insert({
        baby_id: babyId,
        user_id: userId,
        action_type: actionType,
      });

    if (logError) {
      console.warn('Failed to log action:', logError);
    }

    // Return new stats
    const newStats = calculateCurrentStats({
      ...baby,
      hunger: Math.round(newHunger),
      cleanliness: Math.round(newCleanliness),
      fun: Math.round(newFun),
      happiness: Math.round(newHappiness),
      last_action_at: new Date().toISOString(),
    });

    return { success: true, newStats };
  } catch (err: any) {
    return { success: false, error: err.message || 'Something went wrong' };
  }
}

// ===== Cooldowns =====

/**
 * Check if an action is off cooldown
 */
export async function checkCooldown(
  babyId: string,
  userId: string,
  actionType: ActionType
): Promise<{ ready: boolean; remainingMinutes?: number }> {
  const { data: lastAction } = await supabase
    .from('actions')
    .select('performed_at')
    .eq('baby_id', babyId)
    .eq('user_id', userId)
    .eq('action_type', actionType)
    .order('performed_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastAction) return { ready: true };

  const lastTime = new Date(lastAction.performed_at).getTime();
  const cooldown = ACTION_COOLDOWNS[actionType];
  const now = Date.now();
  const elapsed = now - lastTime;

  if (elapsed >= cooldown) return { ready: true };

  const remaining = Math.ceil((cooldown - elapsed) / (1000 * 60));
  return { ready: false, remainingMinutes: remaining };
}

/**
 * Get all cooldown states for a user+baby
 */
export async function getCooldowns(
  babyId: string,
  userId: string
): Promise<ActionCooldown> {
  const actions: ActionType[] = ['feed', 'diaper', 'play'];
  const cooldowns: ActionCooldown = { feed: null, diaper: null, play: null };

  for (const action of actions) {
    const { data: lastAction } = await supabase
      .from('actions')
      .select('performed_at')
      .eq('baby_id', babyId)
      .eq('user_id', userId)
      .eq('action_type', action)
      .order('performed_at', { ascending: false })
      .limit(1)
      .single();

    if (lastAction) {
      const lastTime = new Date(lastAction.performed_at).getTime();
      const readyAt = lastTime + ACTION_COOLDOWNS[action];
      if (readyAt > Date.now()) {
        cooldowns[action] = readyAt;
      }
    }
  }

  return cooldowns;
}

// ===== Baby Creation =====

/**
 * Create a new baby
 */
export async function createBaby(params: {
  name: string;
  imageUrl: string;
  mode: 'solo' | 'partner';
  creatorId: string;
}): Promise<Baby> {
  const syncCode = params.mode === 'partner' ? generateSyncCode() : null;

  const { data: baby, error: babyError } = await supabase
    .from('babies')
    .insert({
      name: params.name,
      image_url: params.imageUrl,
      mode: params.mode,
      sync_code: syncCode,
    })
    .select()
    .single();

  if (babyError || !baby) {
    throw new Error('Failed to create baby');
  }

  // Add creator as member
  const { error: memberError } = await supabase
    .from('baby_members')
    .insert({
      baby_id: baby.id,
      user_id: params.creatorId,
      role: 'creator',
    });

  if (memberError) {
    throw new Error('Failed to add creator as member');
  }

  return baby;
}

/**
 * Join a baby via sync code
 */
export async function joinBabySyncCode(
  syncCode: string,
  userId: string
): Promise<Baby> {
  const { data: baby, error: findError } = await supabase
    .from('babies')
    .select('*')
    .eq('sync_code', syncCode)
    .single();

  if (findError || !baby) {
    throw new Error('Invalid sync code');
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('baby_members')
    .select('id')
    .eq('baby_id', baby.id)
    .eq('user_id', userId)
    .single();

  if (!existing) {
    const { error: joinError } = await supabase
      .from('baby_members')
      .insert({
        baby_id: baby.id,
        user_id: userId,
        role: 'partner',
      });

    if (joinError) {
      throw new Error('Failed to join baby');
    }
  }

  return baby;
}

// ===== Leaderboard =====

/**
 * Get leaderboard for a baby (this week)
 */
export async function getLeaderboard(babyId: string) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: actions, error } = await supabase
    .from('actions')
    .select(`
      user_id,
      action_type,
      users:user_id (display_name, avatar_url)
    `)
    .eq('baby_id', babyId)
    .gte('performed_at', weekAgo.toISOString());

  if (error || !actions) return [];

  // Aggregate by user
  const userStats: Record<string, any> = {};

  for (const action of actions) {
    const uid = action.user_id;
    if (!userStats[uid]) {
      userStats[uid] = {
        user_id: uid,
        display_name: (action as any).users?.display_name || 'Unknown',
        avatar_url: (action as any).users?.avatar_url || null,
        total_actions: 0,
        feeds: 0,
        diapers: 0,
        plays: 0,
      };
    }
    userStats[uid].total_actions++;
    if (action.action_type === 'feed') userStats[uid].feeds++;
    if (action.action_type === 'diaper') userStats[uid].diapers++;
    if (action.action_type === 'play') userStats[uid].plays++;
  }

  // Sort by total actions and add rank
  const leaderboard = Object.values(userStats)
    .sort((a: any, b: any) => b.total_actions - a.total_actions)
    .map((entry: any, index: number) => ({ ...entry, rank: index + 1 }));

  return leaderboard;
}

/**
 * Get baby age as a friendly string
 */
export function getBabyAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Born today! 🎂';
  if (diffDays === 1) return '1 day old';
  if (diffDays < 7) return `${diffDays} days old`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} old`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} old`;
}

// ===== Utilities =====

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
