/**
 * Stripe Service — Ember
 * Handles subscription payments ($3/month)
 */

import Constants from 'expo-constants';
import { supabase } from './supabase';
import { Subscription } from '../types';

const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || '';

// ===== Subscription Management =====

/**
 * Get user's subscription status
 */
export async function getSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Check if user has an active subscription
 */
export async function isSubscribed(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (!sub) return false;

  if (sub.status === 'active') {
    // Check if still within period
    if (sub.current_period_end) {
      return new Date(sub.current_period_end) > new Date();
    }
    return true;
  }

  return false;
}

/**
 * Check if user is in free trial
 */
export async function isInFreeTrial(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (!sub) return true; // No subscription = free trial

  return sub.status === 'free';
}

/**
 * Create a checkout session (server-side in production)
 * In production, this would call your backend API
 */
export async function createCheckoutSession(userId: string): Promise<{
  success: boolean;
  sessionUrl?: string;
  error?: string;
}> {
  try {
    // In production, call your edge function:
    // const { data, error } = await supabase.functions.invoke('create-checkout', {
    //   body: { userId, priceId: 'price_xxx' }
    // });

    // For now, simulate
    console.log('Creating checkout session for user:', userId);

    return {
      success: true,
      sessionUrl: 'https://checkout.stripe.com/demo',
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Handle subscription webhook update (called from backend)
 */
export async function updateSubscription(params: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: string;
}): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: params.userId,
      stripe_customer_id: params.stripeCustomerId,
      stripe_subscription_id: params.stripeSubscriptionId,
      status: params.status,
      current_period_end: params.currentPeriodEnd,
    }, { onConflict: 'user_id' });

  if (error) {
    throw new Error('Failed to update subscription');
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // In production, call your edge function:
    // const { data, error } = await supabase.functions.invoke('cancel-subscription', {
    //   body: { userId }
    // });

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Get subscription display info
 */
export function getSubscriptionDisplay(sub: Subscription | null) {
  if (!sub || sub.status === 'free') {
    return {
      label: 'Free',
      description: 'Basic features',
      badge: '✨',
      color: '#98D8C8',
      isActive: false,
    };
  }

  if (sub.status === 'active') {
    return {
      label: 'Ember Pro',
      description: 'All features unlocked',
      badge: '🔥',
      color: '#FF6B6B',
      isActive: true,
    };
  }

  if (sub.status === 'cancelled') {
    return {
      label: 'Cancelled',
      description: sub.current_period_end
        ? `Active until ${new Date(sub.current_period_end).toLocaleDateString()}`
        : 'Subscription ended',
      badge: '⏳',
      color: '#FFD700',
      isActive: false,
    };
  }

  return {
    label: 'Past Due',
    description: 'Please update your payment method',
    badge: '⚠️',
    color: '#FF6B6B',
    isActive: false,
  };
}

export { STRIPE_PUBLISHABLE_KEY };
