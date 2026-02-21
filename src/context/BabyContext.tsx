/**
 * Baby Context — Ember
 * Global baby state: currentBaby, stats, actions
 * Demo-mode aware
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Baby, BabyStats } from '../types';
import { calculateCurrentStats } from '../lib/baby-engine-pure';
import { DEMO_MODE } from '../lib/supabase';
import { mockDb, DEMO_BABY, DEMO_USER } from '../lib/mock';
import { performAction as enginePerformAction } from '../lib/baby-engine';

// ===== Demo Data (canonical) =====

export const DEMO_BABY_DATA: Baby = {
  id: 'demo-baby',
  name: 'Sage',
  image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=512&h=512&fit=crop&crop=face',
  happiness: 75,
  hunger: 80,
  cleanliness: 70,
  fun: 65,
  mode: 'solo',
  sync_code: 'EMBER-1234',
  created_at: new Date().toISOString(),
  last_action_at: new Date().toISOString(),
};

export const DEMO_USER_DATA = {
  id: 'demo-user',
  email: 'joshua@ember.app',
  display_name: 'Joshua',
};

// ===== Context Types =====

interface BabyContextType {
  currentBaby: Baby | null;
  currentStats: BabyStats | null;
  userId: string | null;
  babyId: string | null;
  loading: boolean;
  hasBaby: boolean;
  setBaby: (baby: Baby) => void;
  refreshBaby: () => Promise<void>;
  performAction: (type: 'feed' | 'diaper' | 'play') => Promise<void>;
}

const BabyContext = createContext<BabyContextType>({
  currentBaby: null,
  currentStats: null,
  userId: null,
  babyId: null,
  loading: true,
  hasBaby: false,
  setBaby: () => {},
  refreshBaby: async () => {},
  performAction: async () => {},
});

// ===== Provider =====

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [currentStats, setCurrentStats] = useState<BabyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = DEMO_MODE ? DEMO_USER_DATA.id : null;
  const babyId = currentBaby?.id ?? null;

  // Initialize in demo mode
  useEffect(() => {
    if (DEMO_MODE) {
      const baby = { ...DEMO_BABY_DATA };
      setCurrentBaby(baby);
      setCurrentStats(calculateCurrentStats(baby));
      setLoading(false);
    } else {
      // In real mode, wait for auth + baby fetch
      setLoading(false);
    }
  }, []);

  // Recompute stats when baby changes
  useEffect(() => {
    if (currentBaby) {
      setCurrentStats(calculateCurrentStats(currentBaby));
    }
  }, [currentBaby]);

  const setBaby = useCallback((baby: Baby) => {
    setCurrentBaby(baby);
    setCurrentStats(calculateCurrentStats(baby));
  }, []);

  const refreshBaby = useCallback(async () => {
    if (!babyId) return;
    if (DEMO_MODE) {
      const baby = await mockDb.getBaby(babyId);
      setCurrentBaby(baby);
      setCurrentStats(calculateCurrentStats(baby));
    }
  }, [babyId]);

  const performAction = useCallback(async (type: 'feed' | 'diaper' | 'play') => {
    if (!babyId || !userId) return;
    const result = await enginePerformAction(babyId, userId, type);
    if (result.success && result.newStats) {
      setCurrentStats(result.newStats);
      // Update local baby stats too
      if (currentBaby) {
        setCurrentBaby(prev => prev ? {
          ...prev,
          hunger: result.newStats!.hunger,
          cleanliness: result.newStats!.cleanliness,
          fun: result.newStats!.fun,
          happiness: result.newStats!.happiness,
          last_action_at: new Date().toISOString(),
        } : prev);
      }
    }
  }, [babyId, userId, currentBaby]);

  return (
    <BabyContext.Provider value={{
      currentBaby,
      currentStats,
      userId,
      babyId,
      loading,
      hasBaby: !!currentBaby,
      setBaby,
      refreshBaby,
      performAction,
    }}>
      {children}
    </BabyContext.Provider>
  );
}

export const useBaby = () => useContext(BabyContext);
