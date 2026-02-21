/**
 * Mock / Demo Mode — Ember
 *
 * When EXPO_PUBLIC_DEMO_MODE=true (or no real Supabase keys are set),
 * this module provides stub implementations of all data calls so the
 * full UI can be explored without a live backend.
 *
 * Usage: imported automatically by supabase.ts when keys are placeholders.
 */

import { Baby, BabyStats, LeaderboardEntry, User } from '../types';
import { calculateCurrentStats } from './baby-engine-pure';

// ===== Demo Data =====

export const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@ember.app',
  display_name: 'Demo Parent',
  avatar_url: null,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export const DEMO_BABY: Baby = {
  id: 'demo-baby-001',
  name: 'Ember',
  image_url: null,
  happiness: 85,
  hunger: 75,
  cleanliness: 90,
  fun: 80,
  mode: 'solo',
  sync_code: null,
  created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  last_action_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
};

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    user_id: 'demo-user-001',
    display_name: 'Demo Parent 🏆',
    avatar_url: null,
    total_actions: 24,
    feeds: 10,
    diapers: 6,
    plays: 8,
    rank: 1,
  },
  {
    user_id: 'demo-user-002',
    display_name: 'Partner',
    avatar_url: null,
    total_actions: 18,
    feeds: 7,
    diapers: 5,
    plays: 6,
    rank: 2,
  },
];

// ===== Mock Auth =====

export const mockAuth = {
  getSession: async () => ({
    data: {
      session: {
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          user_metadata: { full_name: DEMO_USER.display_name },
        },
        access_token: 'demo-token',
      },
    },
    error: null,
  }),

  getUser: async () => ({
    data: { user: { id: DEMO_USER.id, email: DEMO_USER.email } },
    error: null,
  }),

  onAuthStateChange: (callback: Function) => {
    // Immediately fire as signed in
    setTimeout(() => {
      callback('SIGNED_IN', {
        user: { id: DEMO_USER.id, email: DEMO_USER.email },
        access_token: 'demo-token',
      });
    }, 100);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },

  signInWithOtp: async () => ({ data: {}, error: null }),
  signInWithPassword: async () => ({
    data: { user: { id: DEMO_USER.id, email: DEMO_USER.email } },
    error: null,
  }),
  signUp: async () => ({
    data: { user: { id: DEMO_USER.id, email: DEMO_USER.email } },
    error: null,
  }),
  signInWithOAuth: async () => ({ data: {}, error: null }),
  signOut: async () => ({ error: null }),
};

// ===== Mock Database =====

let _baby = { ...DEMO_BABY };

export const mockDb = {
  getBaby: async (id: string): Promise<Baby> => {
    await delay(200);
    return _baby;
  },

  updateBaby: async (id: string, updates: Partial<Baby>): Promise<Baby> => {
    await delay(150);
    _baby = { ..._baby, ...updates };
    return _baby;
  },

  getLeaderboard: async (babyId: string): Promise<LeaderboardEntry[]> => {
    await delay(300);
    return DEMO_LEADERBOARD;
  },

  getUserProfile: async (userId: string): Promise<User> => {
    await delay(100);
    return DEMO_USER;
  },

  upsertUserProfile: async (profile: Partial<User>): Promise<User> => {
    await delay(100);
    return { ...DEMO_USER, ...profile } as User;
  },

  logAction: async (babyId: string, userId: string, actionType: string) => {
    await delay(100);
    return { id: `action-${Date.now()}`, baby_id: babyId, user_id: userId, action_type: actionType, performed_at: new Date().toISOString() };
  },

  getLastAction: async (babyId: string, userId: string, actionType: string) => {
    // Return null = no cooldown in demo mode
    return null;
  },
};

// ===== Channels / Realtime =====

export const mockChannel = () => ({
  on: () => mockChannel(),
  subscribe: () => ({ unsubscribe: () => {} }),
  unsubscribe: () => {},
});

// ===== Helpers =====

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const IS_DEMO_MODE = true;
