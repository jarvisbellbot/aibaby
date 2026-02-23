// Baby types and interfaces for the Ember Alive system

export type BabyEmotion = 
  | 'joyful' 
  | 'happy' 
  | 'content' 
  | 'curious' 
  | 'tired'
  | 'hungry' 
  | 'crying' 
  | 'sad' 
  | 'lonely'
  | 'uncomfortable'
  | 'sleeping'
  | 'surprised'
  | 'excited';

export type GrowthStage = 
  | 'newborn'      // 0-2 weeks
  | 'infant'       // 2 weeks - 3 months
  | 'baby'         // 3-6 months
  | 'crawler'      // 6-12 months
  | 'toddler';     // 12+ months

export interface BabyPersonality {
  fussiness: number;      // 0-1, how easily upset
  curiosity: number;      // 0-1, how interested in new things
  affection: number;      // 0-1, how much they seek contact
  energy: number;         // 0-1, activity level
  sociability: number;    // 0-1, response to social interaction
  temperament: 'calm' | 'playful' | 'sensitive' | 'curious' | 'active';
}

export interface BabyStats {
  hunger: number;         // 0-100
  energy: number;         // 0-100 (sleep)
  happiness: number;      // 0-100
  hygiene: number;        // 0-100
  attention: number;      // 0-100
  health: number;         // 0-100 (overall)
}

export interface LearnedSkill {
  id: string;
  name: string;
  description: string;
  learnedAt: Date;
  stage: GrowthStage;
  icon: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedAt: Date;
  type: 'physical' | 'cognitive' | 'social' | 'language';
  icon: string;
  shareableImage?: string;
}

export interface Interaction {
  type: 'feed' | 'play' | 'sleep' | 'wake' | 'diaper' | 'clean' | 'talk' | 'tickle' | 'cuddle' | 'milestone';
  timestamp: Date;
  context?: string;
  emotionalImpact?: number;
}

export interface CareNeed {
  type: 'hunger' | 'sleep' | 'hygiene' | 'attention' | 'health';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestedAction?: string;
}

export interface BabyMemory {
  id: string;
  type: 'photo' | 'video' | 'milestone' | 'moment';
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption: string;
  createdAt: Date;
  babyAgeDays: number;
  emotionalState?: BabyEmotion;
  sharedTo?: string[];
}

export interface ParentingScenario {
  id: string;
  title: string;
  situation: string;
  options: {
    text: string;
    outcome: string;
    babyReaction: BabyEmotion;
    statEffects: Partial<BabyStats>;
  }[];
  babyStage: GrowthStage;
  category: 'feeding' | 'sleep' | 'comfort' | 'play' | 'health';
}

export interface ParentingAdvice {
  id: string;
  topic: string;
  content: string;
  stage: GrowthStage;
  category: string;
  isBookmarked: boolean;
}

export interface SocialShare {
  id: string;
  type: 'milestone' | 'photo' | 'moment' | 'comparison';
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  likes: number;
  comments: SocialComment[];
}

export interface SocialComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface VoiceMessage {
  id: string;
  text: string;
  audioUrl: string;
  babyEmotion: BabyEmotion;
  createdAt: Date;
  context: string;
}

export interface NotificationPreference {
  type: 'need' | 'milestone' | 'miss_you' | 'daily_summary' | 'sleep_reminder';
  enabled: boolean;
  soundEnabled: boolean;
  quietHoursStart?: number; // 0-23
  quietHoursEnd?: number;   // 0-23
}
