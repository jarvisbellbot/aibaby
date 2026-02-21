/**
 * Ember Constants
 */

// App info
export const APP_NAME = 'Ember';
export const APP_TAGLINE = 'Every love story deserves a chapter';
export const APP_VERSION = '1.0.0';

// Subscription
export const SUBSCRIPTION_PRICE = '$3';
export const SUBSCRIPTION_PERIOD = 'month';
export const FREE_TRIAL_DAYS = 7;

// Baby engine
export const STAT_DECAY = {
  hunger: 5,      // per hour
  cleanliness: 3, // per hour
  fun: 2,         // per hour
};

export const ACTION_EFFECTS = {
  feed: { hunger: 30, happiness: 5, cleanliness: 0, fun: 0 },
  diaper: { hunger: 0, happiness: 10, cleanliness: 40, fun: 0 },
  play: { hunger: 0, happiness: 15, fun: 25, cleanliness: 0 },
};

export const ACTION_COOLDOWNS = {
  feed: 30 * 60 * 1000,    // 30 minutes
  diaper: 60 * 60 * 1000,  // 1 hour
  play: 15 * 60 * 1000,    // 15 minutes
};

export const MOOD_THRESHOLDS = {
  happy: 80,
  okay: 50,
  sad: 20,
  crying: 0,
};

export const MOOD_EMOJIS = {
  happy: '😊',
  okay: '😐',
  sad: '😢',
  crying: '😭',
};

export const HAPPINESS_WEIGHTS = {
  hunger: 0.3,
  cleanliness: 0.3,
  fun: 0.4,
};

// Generation progress messages — emotional copy that primes attachment during the wait
export const GENERATION_MESSAGES: Record<string, string> = {
  uploading: 'Uploading your photos... 📸',
  analyzing: 'Combining the best of both of you... 👨‍👩‍👧',
  mixing: 'Sprinkling in a little magic ✨',
  generating: 'Adding those perfect little fingers... 🤞',
  finishing: 'Almost ready to meet the world... 👶',
  complete: 'Your baby is here! 🎉',
};

// Onboarding copy — emotionally resonant, designed to create attachment at every step
export const ONBOARDING_COPY = {
  welcome: {
    title: 'See your baby\nbefore they\'re born',
    subtitle: 'AI-powered. Surprisingly real.',
    cta: 'Create My Baby',
  },
  modeSelect: {
    title: 'How would you like\nto start?',
    subtitle: "Choose your adventure",
    solo: {
      title: 'Solo',
      subtitle: 'Just me and my baby',
      emoji: '🌟',
    },
    partner: {
      title: 'Together',
      subtitle: 'With someone special',
      emoji: '💕',
    },
  },
  photoUpload: {
    title: "Let's see those\ngood genes",
    subtitle: 'Upload a clear photo of your face',
    hint: 'Good lighting + front-facing works best 😏',
  },
  partnerInvite: {
    title: "Invite your\npartner",
    subtitle: 'Share this code so they can join the fun',
  },
  generating: {
    title: "Creating something\nmagical...",
  },
  reveal: {
    title: 'Meet your baby ✨',
    subtitle: 'Your baby is here',
  },
  naming: {
    title: "What will you\ncall them?",
    subtitle: 'Every baby deserves a perfect name',
    suggestions: ['Luna', 'Sage', 'River', 'Nova', 'Kai', 'Eden', 'Aria', 'Finn', 'Ember', 'Willow'],
  },
  tutorial: {
    steps: [
      {
        title: 'Feed Your Baby',
        subtitle: 'Keep their tummy full and happy',
        emoji: '🍼',
        color: '#FFA07A',
      },
      {
        title: 'Change Diaper',
        subtitle: 'Clean baby = happy baby',
        emoji: '🧷',
        color: '#98D8C8',
      },
      {
        title: 'Play Together',
        subtitle: "Playtime is the best time!",
        emoji: '🎮',
        color: '#E6E6FA',
      },
    ],
    cta: "Let's go! 🔥",
  },
};

// Share templates
export const SHARE_TEMPLATES = {
  instagram: 'Meet our baby on Ember! 👶✨ #EmberBaby #FutureBaby',
  tiktok: 'We just had a baby on @ember 👶🔥 Link in bio!',
  sms: "Look at our baby on Ember! 😍 Download the app to meet them: https://ember.app",
  general: 'Our baby on Ember is so cute! 🥰 Check it out: https://ember.app',
};
