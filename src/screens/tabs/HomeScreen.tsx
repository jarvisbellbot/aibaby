/**
 * Home Screen — Ember
 * Main baby care screen — wired to BabyContext
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ScrollView, SafeAreaView, Animated,
} from 'react-native';
import { useBaby } from '../../context/BabyContext';
import { BabyAvatar } from '../../components/baby/BabyAvatar';
import { HappinessMeter } from '../../components/baby/HappinessMeter';
import { ActionButton } from '../../components/baby/ActionButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const { currentBaby, currentStats, loading, performAction, refreshBaby, setBaby } = useBaby();
  const [refreshing, setRefreshing] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  // ── Reaction animation ───────────────────────────────────────────────────
  const reactionAnim = useRef(new Animated.Value(0)).current;
  const reactionOpacity = useRef(new Animated.Value(0)).current;
  const [reactionEmoji, setReactionEmoji] = useState('💕');

  // ── Passive stats decay ──────────────────────────────────────────────────
  useEffect(() => {
    if (!currentBaby) return;
    const interval = setInterval(() => {
      setBaby({
        ...currentBaby,
        hunger: Math.max(0, (currentBaby.hunger ?? 80) - 3),
        fun: Math.max(0, (currentBaby.fun ?? 65) - 2),
        cleanliness: Math.max(0, (currentBaby.cleanliness ?? 70) - 1),
      });
    }, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, [currentBaby]);

  const triggerReaction = (type: 'feed' | 'diaper' | 'play') => {
    const emojiMap = { feed: '🍼', diaper: '✨', play: '🎮' };
    setReactionEmoji(emojiMap[type]);
    reactionAnim.setValue(0);
    reactionOpacity.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(reactionOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(800),
        Animated.timing(reactionOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(reactionAnim, {
        toValue: -60,
        duration: 1100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      reactionAnim.setValue(0);
    });
  };

  // ── Memoized computed values ─────────────────────────────────────────────
  const greeting = useMemo(
    () => getTimeGreeting(currentBaby?.name ?? ''),
    [currentBaby?.name]
  );
  const moodMessage = useMemo(
    () => getMoodMessage(currentStats?.happiness ?? 70, currentBaby?.name ?? ''),
    [currentStats?.happiness, currentBaby?.name]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBaby();
    setRefreshing(false);
  }, [refreshBaby]);

  async function handleAction(type: 'feed' | 'diaper' | 'play') {
    setActionLoading(true);
    await performAction(type);
    setActionLoading(false);
    triggerReaction(type);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <LoadingOverlay />
      </View>
    );
  }

  if (!currentBaby || !currentStats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyEmoji}>👶</Text>
        <Text style={styles.emptyText}>No baby yet!</Text>
        <Text style={styles.emptySubtext}>Complete onboarding to meet your baby.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>
            {currentBaby.name} {currentStats.moodEmoji}
          </Text>
        </View>

        {/* Baby Avatar + reaction overlay */}
        <View style={styles.avatarWrapper}>
          <BabyAvatar
            imageUrl={currentBaby.image_url}
            mood={currentStats.mood}
            happiness={currentStats.happiness}
            size={200}
            name={undefined}
          />
          {/* Floating reaction emoji */}
          <Animated.Text
            style={[
              styles.reactionEmoji,
              {
                opacity: reactionOpacity,
                transform: [{ translateY: reactionAnim }],
              },
            ]}
          >
            {reactionEmoji}
          </Animated.Text>
        </View>

        {/* Happiness Meter */}
        <View style={styles.meterWrap}>
          <HappinessMeter value={currentStats.happiness} />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill emoji="🍼" label="Hunger" value={currentStats.hunger} color={colors.actionFeed} />
          <StatPill emoji="🧷" label="Clean" value={currentStats.cleanliness} color={colors.actionDiaper} />
          <StatPill emoji="🎮" label="Fun" value={currentStats.fun} color="#9090C8" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsLabel}>
          <Text style={styles.actionsTitle}>Take care of {currentBaby.name}</Text>
        </View>
        <View style={styles.actions}>
          <ActionButton type="feed" onPress={() => handleAction('feed')} disabled={actionLoading} />
          <ActionButton type="diaper" onPress={() => handleAction('diaper')} disabled={actionLoading} />
          <ActionButton type="play" onPress={() => handleAction('play')} disabled={actionLoading} />
        </View>

        {/* Mood message */}
        <View style={styles.moodCard}>
          <Text style={styles.moodText}>{moodMessage}</Text>
        </View>
      </ScrollView>

      {actionLoading && <LoadingOverlay />}
    </SafeAreaView>
  );
}

function StatPill({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <View style={[statStyles.pill, { borderColor: color + '44' }]}>
      <Text style={statStyles.emoji}>{emoji}</Text>
      <Text style={[statStyles.value, { color }]}>{Math.round(value)}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  emoji: { fontSize: 20, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
});

function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning! ☀️ ${name} woke up happy!`;
  if (hour < 17) return `Afternoon! ${name} has been waiting for you 💕`;
  return `Good evening! ${name} wants to say goodnight 🌙`;
}

function getMoodMessage(happiness: number, name: string): string {
  if (happiness >= 80) return `${name} is super happy right now! 🌟 Keep it up!`;
  if (happiness >= 60) return `${name} is doing okay. A little love goes a long way 💕`;
  if (happiness >= 40) return `${name} could use some attention! Try feeding or playing 🍼`;
  return `${name} really needs you right now! 😢 Don't leave them alone!`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  header: { width: '100%', paddingTop: 20, marginBottom: 24 },
  greeting: { fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  name: { fontSize: 32, fontWeight: '900', color: colors.text },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  reactionEmoji: {
    position: 'absolute',
    top: -10,
    fontSize: 36,
    zIndex: 10,
    pointerEvents: 'none',
  } as any,
  meterWrap: { width: '100%', marginTop: 28, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 28 },
  actionsLabel: { width: '100%', marginBottom: 16 },
  actionsTitle: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  moodCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  moodText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
