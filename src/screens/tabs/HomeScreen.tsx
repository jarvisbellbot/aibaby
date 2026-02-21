/**
 * Home Screen — Ember
 * Main baby care screen — wired to BabyContext
 */

import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ScrollView, SafeAreaView,
} from 'react-native';
import { useBaby } from '../../context/BabyContext';
import { BabyAvatar } from '../../components/baby/BabyAvatar';
import { HappinessMeter } from '../../components/baby/HappinessMeter';
import { ActionButton } from '../../components/baby/ActionButton';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const { currentBaby, currentStats, loading, performAction, refreshBaby } = useBaby();
  const [refreshing, setRefreshing] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBaby();
    setRefreshing(false);
  }, [refreshBaby]);

  async function handleAction(type: 'feed' | 'diaper' | 'play') {
    setActionLoading(true);
    await performAction(type);
    setActionLoading(false);
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
          <Text style={styles.greeting}>{getTimeGreeting(currentBaby.name)}</Text>
          <Text style={styles.name}>
            {currentBaby.name} {currentStats.moodEmoji}
          </Text>
        </View>

        {/* Baby Avatar */}
        <BabyAvatar
          imageUrl={currentBaby.image_url}
          mood={currentStats.mood}
          happiness={currentStats.happiness}
          size={200}
          name={undefined}
        />

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
          <Text style={styles.moodText}>{getMoodMessage(currentStats.happiness, currentBaby.name)}</Text>
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
