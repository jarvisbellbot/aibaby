/**
 * Supabase Client — Ember
 * Handles database connections and real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://your-project.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'your-anon-key';

// Custom storage adapter using expo-secure-store
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Silently fail — don't crash the app
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Silently fail
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ===== Helper Functions =====

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get user profile from our users table
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(profile: {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Subscribe to real-time changes on a baby
 */
export function subscribeToBaby(
  babyId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`baby:${babyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'babies',
        filter: `id=eq.${babyId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to real-time actions on a baby (for leaderboard updates)
 */
export function subscribeToActions(
  babyId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`actions:${babyId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'actions',
        filter: `baby_id=eq.${babyId}`,
      },
      callback
    )
    .subscribe();
}
