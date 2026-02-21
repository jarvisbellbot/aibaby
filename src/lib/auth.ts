/**
 * Auth Service — Ember
 * Google, Apple, and Email authentication
 */

import { supabase, upsertUserProfile } from './supabase';

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Sign in with email (magic link)
 */
export async function signInWithEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'ember://auth/callback',
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send magic link' };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };

    if (data.user) {
      await upsertUserProfile({
        id: data.user.id,
        email: data.user.email!,
        display_name: data.user.user_metadata?.full_name || undefined,
        avatar_url: data.user.user_metadata?.avatar_url || undefined,
      });
    }

    return { success: true, userId: data.user?.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Sign in failed' };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName },
      },
    });

    if (error) return { success: false, error: error.message };

    if (data.user) {
      await upsertUserProfile({
        id: data.user.id,
        email: data.user.email!,
        display_name: displayName || undefined,
      });
    }

    return { success: true, userId: data.user?.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Sign up failed' };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'ember://auth/callback',
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Google sign in failed' };
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'ember://auth/callback',
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Apple sign in failed' };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
