/**
 * Home Screen — Ember
 * Main baby care screen
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Baby, BabyStats } from '../../types';
import { calculateCurrentStats, performAction } from '../../lib/baby-engine';
import { subscribeToBaby } from '../../lib/supabase';
import { BabyAvatar } from '../../components/baby/BabyAvatar';
import { HappinessMeter } from '../../components/baby/HappinessMeter';
import { ActionButton } from '../../components/baby/ActionButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const [baby, setBaby] = useState<Baby | null>(null);
  const [stats, setStats] = useState<BabyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: Get babyId + userId from context/route
  const babyId = '';
  const userId = '';

  useEffect(() => {
    if (!babyId) return;
    const subscription = subscribeToBaby(babyId, (payload) => {
      if (payload.new) {
        setBaby(payload.new as Baby);
        setStats(calculateCurrentStats(payload.new as Baby));
      }
    });
    return () => { subscription.unsubscribe(); };
  }, [babyId]);

  useEffect(() => {
    if (baby) setStats(calculateCurrentStats(baby));
  }, [baby]);

  async function handleAction(type: 'feed' | 'diaper' | 'play') {
    if (!babyId || !userId) return;
    setLoading(true);
    const result = await performAction(babyId, userId, type);
    setLoading(false);
    if (result.newStats) setStats(result.newStats);
  }

  if (!baby || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Loading your baby... 👶</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
    >
      <Text style={styles.name}>{baby.name} {stats.moodEmoji}</Text>
      <BabyAvatar imageUrl={baby.image_url} mood={stats.mood} size={200} />
      <HappinessMeter value={stats.happiness} />

      <View style={styles.stats}>
        <Text style={styles.statItem}>🍼 {stats.hunger}</Text>
        <Text style={styles.statItem}>🧷 {stats.cleanliness}</Text>
        <Text style={styles.statItem}>🎮 {stats.fun}</Text>
      </View>

      <View style={styles.actions}>
        <ActionButton type="feed" onPress={() => handleAction('feed')} />
        <ActionButton type="diaper" onPress={() => handleAction('diaper')} />
        <ActionButton type="play" onPress={() => handleAction('play')} />
      </View>

      {loading && <LoadingOverlay />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { alignItems: 'center', padding: 24, paddingTop: 60 },
  name: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
  stats: { flexDirection: 'row', gap: 24, marginVertical: 16 },
  statItem: { fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 16, marginTop: 32 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 100 },
});
