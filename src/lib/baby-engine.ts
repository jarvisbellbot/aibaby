/**
 * Baby Engine — Ember
 * Core logic for baby stats, decay, actions, and mood
 * Demo-mode aware: falls back to local mock data when no real Supabase keys.
 */

import { supabase, DEMO_MODE } from './supabase';
import { mockDb, DEMO_BABY } from './mock';
import { calculateCurrentStats, getMood } from './baby-engine-pure';
import {
  Baby, BabyStats, BabyMood, ActionType, ActionCooldown, BabyAction,
} from '../types';
import {
  ACTION_EFFECTS, ACTION_COOLDOWNS, MOOD_EMOJIS,
} from '../constants';

// Re-export pure helpers for backwards compat
export { calculateCurrentStats, getMood } from './baby-engine-pure';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ===== Actions =====

export async function performAction(
  babyId: string,
  userId: string,
  actionType: ActionType
): Promise<{ success: boolean; error?: string; newStats?: BabyStats }> {
  try {
    if (DEMO_MODE) {
      // Demo: apply effects locally
      const baby = await mockDb.getBaby(babyId);
      const currentStats = calculateCurrentStats(baby);
      const effects = ACTION_EFFECTS[actionType];
      const updated = {
        ...baby,
        hunger: clamp(currentStats.hunger + effects.hunger, 0, 100),
        cleanliness: clamp(currentStats.cleanliness + effects.cleanliness, 0, 100),
        fun: clamp(currentStats.fun + effects.fun, 0, 100),
        last_action_at: new Date().toISOString(),
      };
      await mockDb.updateBaby(babyId, updated);
      return { success: true, newStats: calculateCurrentStats(updated as Baby) };
    }

    // Check cooldown
    const cooldownCheck = await checkCooldown(babyId, userId, actionType);
    if (!cooldownCheck.ready) {
      return { success: false, error: `Please wait ${cooldownCheck.remainingMinutes} more minutes 💕` };
    }

    const { data: baby, error: fetchError } = await supabase.from('babies').select('*').eq('id', babyId).single();
    if (fetchError || !baby) return { success: false, error: 'Baby not found' };

    const currentStats = calculateCurrentStats(baby);
    const effects = ACTION_EFFECTS[actionType];
    const newHunger = clamp(currentStats.hunger + effects.hunger, 0, 100);
    const newCleanliness = clamp(currentStats.cleanliness + effects.cleanliness, 0, 100);
    const newFun = clamp(currentStats.fun + effects.fun, 0, 100);
    const newHappiness = clamp(currentStats.happiness + (effects as any).happiness || 0, 0, 100);

    const { error: updateError } = await supabase.from('babies').update({
      hunger: Math.round(newHunger),
      cleanliness: Math.round(newCleanliness),
      fun: Math.round(newFun),
      happiness: Math.round(newHappiness),
      last_action_at: new Date().toISOString(),
    }).eq('id', babyId);

    if (updateError) return { success: false, error: 'Failed to update baby stats' };

    await supabase.from('actions').insert({ baby_id: babyId, user_id: userId, action_type: actionType });

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

export async function checkCooldown(
  babyId: string,
  userId: string,
  actionType: ActionType
): Promise<{ ready: boolean; remainingMinutes?: number }> {
  if (DEMO_MODE) return { ready: true };

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

  const lastTime = new Date((lastAction as any).performed_at).getTime();
  const cooldown = ACTION_COOLDOWNS[actionType];
  const elapsed = Date.now() - lastTime;

  if (elapsed >= cooldown) return { ready: true };
  const remaining = Math.ceil((cooldown - elapsed) / (1000 * 60));
  return { ready: false, remainingMinutes: remaining };
}

export async function getCooldowns(babyId: string, userId: string): Promise<ActionCooldown> {
  if (DEMO_MODE) return { feed: null, diaper: null, play: null };

  const actions: ActionType[] = ['feed', 'diaper', 'play'];
  const cooldowns: ActionCooldown = { feed: null, diaper: null, play: null };

  for (const action of actions) {
    const { data: lastAction } = await supabase
      .from('actions').select('performed_at')
      .eq('baby_id', babyId).eq('user_id', userId).eq('action_type', action)
      .order('performed_at', { ascending: false }).limit(1).single();

    if (lastAction) {
      const readyAt = new Date((lastAction as any).performed_at).getTime() + ACTION_COOLDOWNS[action];
      if (readyAt > Date.now()) cooldowns[action] = readyAt;
    }
  }

  return cooldowns;
}

// ===== Baby Creation =====

export async function createBaby(params: {
  name: string;
  imageUrl: string;
  mode: 'solo' | 'partner';
  creatorId: string;
}): Promise<Baby> {
  if (DEMO_MODE) {
    return {
      ...DEMO_BABY,
      id: `baby-${Date.now()}`,
      name: params.name,
      image_url: params.imageUrl,
      mode: params.mode,
    };
  }

  const syncCode = params.mode === 'partner' ? generateSyncCode() : null;

  const { data: baby, error: babyError } = await supabase
    .from('babies').insert({ name: params.name, image_url: params.imageUrl, mode: params.mode, sync_code: syncCode })
    .select().single();

  if (babyError || !baby) throw new Error('Failed to create baby');

  await supabase.from('baby_members').insert({ baby_id: (baby as any).id, user_id: params.creatorId, role: 'creator' });

  return baby as Baby;
}

export async function joinBabySyncCode(syncCode: string, userId: string): Promise<Baby> {
  if (DEMO_MODE) return DEMO_BABY;

  const { data: baby, error: findError } = await supabase.from('babies').select('*').eq('sync_code', syncCode).single();
  if (findError || !baby) throw new Error('Invalid sync code');

  const { data: existing } = await supabase.from('baby_members').select('id').eq('baby_id', (baby as any).id).eq('user_id', userId).single();
  if (!existing) {
    await supabase.from('baby_members').insert({ baby_id: (baby as any).id, user_id: userId, role: 'partner' });
  }

  return baby as Baby;
}

// ===== Leaderboard =====

export async function getLeaderboard(babyId: string) {
  if (DEMO_MODE) return mockDb.getLeaderboard(babyId);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: actions, error } = await supabase
    .from('actions')
    .select(`user_id, action_type, users:user_id (display_name, avatar_url)`)
    .eq('baby_id', babyId)
    .gte('performed_at', weekAgo.toISOString());

  if (error || !actions) return [];

  const userStats: Record<string, any> = {};

  for (const action of actions as any[]) {
    const uid = action.user_id;
    if (!userStats[uid]) {
      userStats[uid] = {
        user_id: uid,
        display_name: action.users?.display_name || 'Unknown',
        avatar_url: action.users?.avatar_url || null,
        total_actions: 0, feeds: 0, diapers: 0, plays: 0,
      };
    }
    userStats[uid].total_actions++;
    if (action.action_type === 'feed') userStats[uid].feeds++;
    if (action.action_type === 'diaper') userStats[uid].diapers++;
    if (action.action_type === 'play') userStats[uid].plays++;
  }

  return Object.values(userStats)
    .sort((a: any, b: any) => b.total_actions - a.total_actions)
    .map((entry: any, index: number) => ({ ...entry, rank: index + 1 }));
}

// ===== Baby Age =====

export function getBabyAge(createdAt: string): string {
  const diffDays = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Born today! 🎂';
  if (diffDays === 1) return '1 day old';
  if (diffDays < 7) return `${diffDays} days old`;
  if (diffDays < 30) { const w = Math.floor(diffDays / 7); return `${w} week${w > 1 ? 's' : ''} old`; }
  const m = Math.floor(diffDays / 30);
  return `${m} month${m > 1 ? 's' : ''} old`;
}

function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
