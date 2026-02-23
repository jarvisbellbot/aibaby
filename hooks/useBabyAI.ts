import { useState, useEffect, useCallback, useRef } from 'react';
import { generateBabyFace } from '../services/ai';
import { 
  BabyState, 
  BabyPersonality, 
  BabyEmotion, 
  GrowthStage,
  Interaction,
  Milestone,
  LearnedSkill,
  CareNeed 
} from '../types/baby';
import { useBabyAvatar } from './useBabyAvatar';

// Constants
const HUNGER_DECAY_RATE = 0.5; // per minute
const ENERGY_DECAY_RATE = 0.3;
const HAPPINESS_DECAY_RATE = 0.2;
const HYGIENE_DECAY_RATE = 0.1;
const ATTENTION_DECAY_RATE = 0.4;

interface BabyAIState {
  // Core stats
  hunger: number;        // 0-100
  energy: number;        // 0-100 (sleep)
  happiness: number;     // 0-100
  hygiene: number;       // 0-100 (diaper)
  attention: number;     // 0-100 (play)
  
  // Personality & Emotions
  personality: BabyPersonality;
  currentEmotion: BabyEmotion;
  
  // Growth
  growthStage: GrowthStage;
  ageInDays: number;
  
  // Learning
  vocabulary: string[];
  skills: LearnedSkill[];
  
  // Interaction history
  lastInteraction: Date;
  interactionHistory: Interaction[];
  milestones: Milestone[];
  
  // State
  isSleeping: boolean;
  isCrying: boolean;
  currentActivity: string | null;
  
  // Visual
  aiFaceUrl: string | null;
}

interface BabyAIActions {
  // Care actions
  feed: () => Promise<void>;
  putToSleep: () => Promise<void>;
  wakeUp: () => Promise<void>;
  play: () => Promise<void>;
  changeDiaper: () => Promise<void>;
  clean: () => Promise<void>;
  
  // Interaction
  talkToBaby: (message: string) => Promise<string>; // Returns baby's response
  tickle: () => Promise<void>;
  cuddle: () => Promise<void>;
  
  // System
  updateStats: () => void;
  checkNeeds: () => CareNeed[];
  generateResponse: (context: string) => Promise<string>;
}

// Personality traits influence behavior
const PERSONALITY_PRESETS: Record<string, BabyPersonality> = {
  calm: {
    fussiness: 0.2,
    curiosity: 0.5,
    affection: 0.8,
    energy: 0.4,
    sociability: 0.6,
    temperament: 'calm'
  },
  playful: {
    fussiness: 0.4,
    curiosity: 0.9,
    affection: 0.7,
    energy: 0.9,
    sociability: 0.8,
    temperament: 'playful'
  },
  sensitive: {
    fussiness: 0.7,
    curiosity: 0.6,
    affection: 0.9,
    energy: 0.3,
    sociability: 0.4,
    temperament: 'sensitive'
  },
  curious: {
    fussiness: 0.3,
    curiosity: 1.0,
    affection: 0.6,
    energy: 0.8,
    sociability: 0.7,
    temperament: 'curious'
  }
};

export function useBabyAI(
  babyName: string,
  parentPhotos: { mom: string; dad: string } | null,
  selectedGender: 'boy' | 'girl' | 'surprise'
): [BabyAIState, BabyAIActions] {
  const [state, setState] = useState<BabyAIState>(() => ({
    hunger: 80,
    energy: 90,
    happiness: 75,
    hygiene: 100,
    attention: 60,
    personality: PERSONALITY_PRESETS.calm,
    currentEmotion: 'content',
    growthStage: 'newborn',
    ageInDays: 0,
    vocabulary: ['mama', 'dada', 'goo', 'gaa'],
    skills: [],
    lastInteraction: new Date(),
    interactionHistory: [],
    milestones: [],
    isSleeping: false,
    isCrying: false,
    currentActivity: null,
    aiFaceUrl: null
  }));

  const { generateExpression, playAnimation } = useBabyAvatar();
  const stateRef = useRef(state);
  stateRef.current = state;

  // Initialize baby face
  useEffect(() => {
    if (parentPhotos && !state.aiFaceUrl) {
      generateBabyFace(parentPhotos.mom, parentPhotos.dad, selectedGender)
        .then(url => {
          setState(s => ({ ...s, aiFaceUrl: url }));
        });
    }
  }, [parentPhotos, selectedGender]);

  // Stat decay system - runs every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setState(current => {
        if (current.isSleeping) {
          // Recover energy while sleeping
          return {
            ...current,
            energy: Math.min(100, current.energy + ENERGY_DECAY_RATE * 2),
            hunger: Math.max(0, current.hunger - HUNGER_DECAY_RATE * 0.5),
          };
        }

        const newState = {
          ...current,
          hunger: Math.max(0, current.hunger - HUNGER_DECAY_RATE),
          energy: Math.max(0, current.energy - ENERGY_DECAY_RATE),
          happiness: Math.max(0, current.happiness - HAPPINESS_DECAY_RATE),
          hygiene: Math.max(0, current.hygiene - HYGIENE_DECAY_RATE),
          attention: Math.max(0, current.attention - ATTENTION_DECAY_RATE),
        };

        // Determine emotion based on stats
        newState.currentEmotion = determineEmotion(newState);
        newState.isCrying = shouldCry(newState);

        return newState;
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Determine emotion based on current stats and personality
  const determineEmotion = (s: BabyAIState): BabyEmotion => {
    if (s.isSleeping) return 'sleeping';
    if (s.isCrying) return 'crying';
    if (s.happiness > 80 && s.energy > 60) return 'joyful';
    if (s.happiness > 60) return 'happy';
    if (s.hunger < 30) return 'hungry';
    if (s.energy < 30) return 'tired';
    if (s.hygiene < 20) return 'uncomfortable';
    if (s.attention < 20) return 'lonely';
    if (s.happiness < 30) return 'sad';
    return 'content';
  };

  const shouldCry = (s: BabyAIState): boolean => {
    return !s.isSleeping && (
      s.hunger < 15 || 
      s.hygiene < 10 || 
      (s.energy < 15 && s.happiness < 20)
    );
  };

  // Check for needs and return prioritized list
  const checkNeeds = useCallback((): CareNeed[] => {
    const needs: CareNeed[] = [];
    const s = stateRef.current;

    if (s.hunger < 40) {
      needs.push({ 
        type: 'hunger', 
        urgency: s.hunger < 20 ? 'critical' : s.hunger < 30 ? 'high' : 'medium',
        message: getNeedMessage('hunger', s.hunger, babyName)
      });
    }

    if (s.energy < 30 && !s.isSleeping) {
      needs.push({
        type: 'sleep',
        urgency: s.energy < 15 ? 'critical' : 'high',
        message: getNeedMessage('sleep', s.energy, babyName)
      });
    }

    if (s.hygiene < 40) {
      needs.push({
        type: 'hygiene',
        urgency: s.hygiene < 20 ? 'critical' : 'medium',
        message: getNeedMessage('hygiene', s.hygiene, babyName)
      });
    }

    if (s.attention < 40) {
      needs.push({
        type: 'attention',
        urgency: s.attention < 20 ? 'high' : 'medium',
        message: getNeedMessage('attention', s.attention, babyName)
      });
    }

    // Sort by urgency
    const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return needs.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  }, [babyName]);

  // Actions
  const feed = useCallback(async () => {
    playAnimation('eating');
    
    setState(s => ({
      ...s,
      hunger: Math.min(100, s.hunger + 50),
      happiness: Math.min(100, s.happiness + 10),
      lastInteraction: new Date(),
      interactionHistory: [...s.interactionHistory, {
        type: 'feed',
        timestamp: new Date(),
        context: 'regular feeding'
      }]
    }));

    await generateResponse(`${babyName} just finished eating and feels content.`);
  }, [babyName, playAnimation]);

  const putToSleep = useCallback(async () => {
    playAnimation('sleeping');
    
    setState(s => ({
      ...s,
      isSleeping: true,
      isCrying: false,
      currentActivity: 'sleeping',
      lastInteraction: new Date()
    }));
  }, [playAnimation]);

  const wakeUp = useCallback(async () => {
    playAnimation('waking');
    
    setState(s => ({
      ...s,
      isSleeping: false,
      energy: Math.max(30, s.energy),
      lastInteraction: new Date(),
      interactionHistory: [...s.interactionHistory, {
        type: 'wake',
        timestamp: new Date(),
        context: 'woke up naturally'
      }]
    }));
  }, [playAnimation]);

  const play = useCallback(async () => {
    playAnimation('playing');
    
    setState(s => {
      // Chance to learn new word during play
      const newVocab = maybeLearnWord(s);
      
      return {
        ...s,
        attention: Math.min(100, s.attention + 40),
        happiness: Math.min(100, s.happiness + 15),
        energy: Math.max(0, s.energy - 10),
        vocabulary: newVocab || s.vocabulary,
        lastInteraction: new Date(),
        interactionHistory: [...s.interactionHistory, {
          type: 'play',
          timestamp: new Date(),
          context: 'play session'
        }]
      };
    });

    await generateResponse(`${babyName} is giggling and playing with you!`);
  }, [playAnimation]);

  const changeDiaper = useCallback(async () => {
    playAnimation('relieved');
    
    setState(s => ({
      ...s,
      hygiene: 100,
      happiness: Math.min(100, s.happiness + 20),
      lastInteraction: new Date(),
      interactionHistory: [...s.interactionHistory, {
        type: 'diaper',
        timestamp: new Date(),
        context: 'diaper change'
      }]
    }));

    await generateResponse(`${babyName} feels so much better now, thank you!`);
  }, [playAnimation]);

  const clean = useCallback(async () => {
    playAnimation('happy');
    
    setState(s => ({
      ...s,
      hygiene: Math.min(100, s.hygiene + 30),
      happiness: Math.min(100, s.happiness + 5),
      lastInteraction: new Date()
    }));
  }, [playAnimation]);

  const tickle = useCallback(async () => {
    playAnimation('laughing');
    
    setState(s => ({
      ...s,
      happiness: Math.min(100, s.happiness + 25),
      attention: Math.min(100, s.attention + 10),
      lastInteraction: new Date(),
      interactionHistory: [...s.interactionHistory, {
        type: 'tickle',
        timestamp: new Date(),
        context: 'tickle play'
      }]
    }));
  }, [playAnimation]);

  const cuddle = useCallback(async () => {
    playAnimation('cuddling');
    
    setState(s => ({
      ...s,
      happiness: Math.min(100, s.happiness + 30),
      attention: Math.min(100, s.attention + 20),
      lastInteraction: new Date(),
      interactionHistory: [...s.interactionHistory, {
        type: 'cuddle',
        timestamp: new Date(),
        context: 'cuddle session'
      }]
    }));
  }, [playAnimation]);

  // AI-powered conversation
  const talkToBaby = useCallback(async (message: string): Promise<string> => {
    const s = stateRef.current;
    
    // Simple response generation based on state and personality
    const response = await generateBabyResponse(
      message, 
      s.currentEmotion, 
      s.personality, 
      s.vocabulary,
      babyName
    );

    playAnimation('talking');

    setState(current => ({
      ...current,
      attention: Math.min(100, current.attention + 15),
      happiness: Math.min(100, current.happiness + 10),
      lastInteraction: new Date(),
      interactionHistory: [...current.interactionHistory, {
        type: 'talk',
        timestamp: new Date(),
        context: `said: "${message}" -> responded: "${response}"`
      }]
    }));

    return response;
  }, [babyName, playAnimation]);

  const generateResponse = useCallback(async (context: string): Promise<string> => {
    // Placeholder for AI-generated baby thoughts/responses
    return `${babyName} is thinking about what just happened...`;
  }, [babyName]);

  const actions: BabyAIActions = {
    feed,
    putToSleep,
    wakeUp,
    play,
    changeDiaper,
    clean,
    talkToBaby,
    tickle,
    cuddle,
    updateStats: () => {}, // Handled by useEffect
    checkNeeds,
    generateResponse
  };

  return [state, actions];
}

// Helper functions
function getNeedMessage(type: string, value: number, babyName: string): string {
  const messages: Record<string, string[]> = {
    hunger: [
      `${babyName}'s tummy is rumbling...`,
      `${babyName} is making hungry noises`,
      `Time for ${babyName}'s feeding!`,
      `${babyName} needs a bottle 🍼`
    ],
    sleep: [
      `${babyName} is rubbing their eyes`,
      `${babyName} looks so sleepy...`,
      `Time for ${babyName}'s nap`,
      `${babyName} needs to rest 😴`
    ],
    hygiene: [
      `${babyName} needs a fresh diaper`,
      `Time to clean up ${babyName}`,
      `${babyName} needs changing 💨`
    ],
    attention: [
      `${babyName} misses you...`,
      `${babyName} wants to play!`,
      `${babyName} needs some love 💕`,
      `Come spend time with ${babyName}`
    ]
  };

  const list = messages[type] || ['Baby needs attention'];
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function maybeLearnWord(state: BabyAIState): string[] | null {
  // 10% chance to learn new word during play
  if (Math.random() > 0.9) {
    const newWords = ['up', 'down', 'ball', 'milk', 'more', 'hug', 'kiss', 'play'];
    const availableWords = newWords.filter(w => !state.vocabulary.includes(w));
    
    if (availableWords.length > 0) {
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      return [...state.vocabulary, word];
    }
  }
  return null;
}

async function generateBabyResponse(
  input: string,
  emotion: BabyEmotion,
  personality: BabyPersonality,
  vocabulary: string[],
  babyName: string
): Promise<string> {
  // Simple rule-based responses for MVP
  // Could be upgraded to actual AI model
  
  const responses: Record<BabyEmotion, string[]> = {
    joyful: ['Hehehe!', 'Yaaay!', 'Wheee!', 'Gooo!'],
    happy: ['Gaa gaa!', 'Mama!', 'Dada!', '*happy cooing*'],
    content: ['*contented sounds*', 'Mmm...', '*blissful sigh*'],
    curious: ['Ooh?', 'Dat?', 'Wassat?', 'Huh?'],
    tired: ['Mmm... sleep...', '*yawns*', 'Nigh nigh...'],
    hungry: ['Milk!', 'Mama milk!', '*fussing*', 'Bottle!'],
    crying: ['Waaah!', '*crying*', 'Mamaaa!', '*distressed sounds*'],
    sad: ['*whimpers*', 'No...', '*sad coo*'],
    lonely: ['Mama?', 'Dada?', '*seeking attention*'],
    uncomfortable: ['Owww...', 'No diaper!', '*squirming*'],
    sleeping: ['*soft breathing*', '*dream sounds*', 'Zzz...'],
    surprised: ['Ooh!', 'Wow!', 'Eee!'],
    excited: ['Yay yay!', 'Go go!', 'Wheee!']
  };

  // Mix in learned vocabulary
  const availableWords = [...responses[emotion], ...vocabulary];
  const index = Math.floor(Math.random() * availableWords.length);
  
  return availableWords[index];
}
