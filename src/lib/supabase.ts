/**
 * Supabase Client — Ember
 * Auto-detects demo mode when real keys aren't configured.
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { mockAuth, mockChannel, mockDb, DEMO_BABY, DEMO_USER } from './mock';

const supabaseUrl: string =
  (Constants.expoConfig?.extra?.supabaseUrl as string) ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey: string =
  (Constants.expoConfig?.extra?.supabaseAnonKey as string) ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

// Demo mode = no real keys
export const DEMO_MODE =
  !supabaseUrl ||
  supabaseUrl.includes('your-project') ||
  supabaseUrl === '' ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseAnonKey === '';

// Custom storage adapter using expo-secure-store
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try { await SecureStore.setItemAsync(key, value); } catch { /* silent */ }
  },
  removeItem: async (key: string): Promise<void> => {
    try { await SecureStore.deleteItemAsync(key); } catch { /* silent */ }
  },
};

// Real Supabase client (only used when not in demo mode)
export const supabase = DEMO_MODE
  ? createMockSupabase()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

/**
 * Build a minimal mock that quacks like supabase-js
 * so every import of `supabase.from(...)` works in demo mode.
 */
function createMockSupabase(): any {
  const chain = (data: any = null, error: any = null) => ({
    data,
    error,
    select: () => chain(data, error),
    eq: () => chain(data, error),
    neq: () => chain(data, error),
    gte: () => chain(data, error),
    lte: () => chain(data, error),
    order: () => chain(data, error),
    limit: () => chain(data, error),
    single: async () => ({ data, error }),
    then: (resolve: any) => resolve({ data, error }),
  });

  return {
    auth: mockAuth,
    from: (table: string) => ({
      select: (cols?: string) => ({
        eq: (col: string, val: any) => ({
          single: async () => {
            if (table === 'babies') return { data: DEMO_BABY, error: null };
            if (table === 'users') return { data: DEMO_USER, error: null };
            return { data: null, error: null };
          },
          order: () => ({ limit: () => ({ single: async () => ({ data: null, error: null }) }) }),
          gte: () => ({ data: [], error: null }),
        }),
        single: async () => {
          if (table === 'babies') return { data: DEMO_BABY, error: null };
          return { data: null, error: null };
        },
      }),
      insert: (payload: any) => ({
        select: () => ({ single: async () => ({ data: { ...payload, id: `mock-${Date.now()}`, created_at: new Date().toISOString() }, error: null }) }),
        then: (r: any) => r({ data: payload, error: null }),
      }),
      update: (payload: any) => ({
        eq: () => ({ data: payload, error: null }),
      }),
      upsert: (payload: any) => ({
        select: () => ({ single: async () => ({ data: { ...DEMO_USER, ...payload }, error: null }) }),
      }),
    }),
    channel: (_name: string) => mockChannel(),
    removeChannel: () => {},
  };
}

// ===== Helper Functions =====

export async function getCurrentUser() {
  if (DEMO_MODE) return { id: DEMO_USER.id, email: DEMO_USER.email };
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserProfile(userId: string) {
  if (DEMO_MODE) return DEMO_USER;
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function upsertUserProfile(profile: {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}) {
  if (DEMO_MODE) return { ...DEMO_USER, ...profile };
  const { data, error } = await supabase.from('users').upsert(profile, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

export function subscribeToBaby(babyId: string, callback: (payload: any) => void) {
  if (DEMO_MODE) {
    // Send a demo update after 2 seconds
    setTimeout(() => callback({ new: DEMO_BABY }), 2000);
    return { unsubscribe: () => {} };
  }
  return supabase
    .channel(`baby:${babyId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'babies', filter: `id=eq.${babyId}` }, callback)
    .subscribe();
}

export function subscribeToActions(babyId: string, callback: (payload: any) => void) {
  if (DEMO_MODE) return { unsubscribe: () => {} };
  return supabase
    .channel(`actions:${babyId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'actions', filter: `baby_id=eq.${babyId}` }, callback)
    .subscribe();
}
