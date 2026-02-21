/**
 * Ember Type Definitions
 */

// ===== Database Types =====

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Baby {
  id: string;
  name: string;
  image_url: string | null;
  happiness: number;
  hunger: number;
  cleanliness: number;
  fun: number;
  mode: 'solo' | 'partner';
  sync_code: string | null;
  created_at: string;
  last_action_at: string;
}

export interface BabyMember {
  id: string;
  baby_id: string;
  user_id: string;
  role: 'creator' | 'partner';
  joined_at: string;
}

export type ActionType = 'feed' | 'diaper' | 'play';

export interface BabyAction {
  id: string;
  baby_id: string;
  user_id: string;
  action_type: ActionType;
  performed_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'free' | 'active' | 'cancelled' | 'past_due';
  current_period_end: string | null;
  created_at: string;
}

// ===== App Types =====

export type BabyMood = 'happy' | 'okay' | 'sad' | 'crying';

export interface BabyStats {
  happiness: number;
  hunger: number;
  cleanliness: number;
  fun: number;
  mood: BabyMood;
  moodEmoji: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_actions: number;
  feeds: number;
  diapers: number;
  plays: number;
  rank: number;
}

export interface ActionCooldown {
  feed: number | null; // timestamp when available, null = ready
  diaper: number | null;
  play: number | null;
}

// ===== Navigation Types =====

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  ModeSelect: undefined;
  PhotoUpload: { mode: 'solo' | 'partner' };
  PartnerInvite: { mode: 'partner' };
  Generating: { photos: string[]; mode: 'solo' | 'partner' };
  BabyReveal: { babyImageUrl: string };
  Naming: { babyImageUrl: string };
  Tutorial: { babyName: string; babyImageUrl: string };
  MainTabs: undefined;
  Subscription: undefined;
  Share: { babyId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

// ===== Onboarding Types =====

export type OnboardingMode = 'solo' | 'partner';

export interface OnboardingState {
  mode: OnboardingMode | null;
  photos: string[];
  partnerSyncCode: string | null;
  babyName: string | null;
  babyImageUrl: string | null;
}

// ===== Generation Progress =====

export type GenerationStage =
  | 'uploading'
  | 'analyzing'
  | 'mixing'
  | 'generating'
  | 'finishing'
  | 'complete';

export interface GenerationProgress {
  stage: GenerationStage;
  progress: number; // 0-100
  message: string;
}
