/**
 * Profile Screen — Ember
 * User profile, baby stats, subscription
 */

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useBaby, DEMO_USER_DATA } from '../../context/BabyContext';
import { colors } from '../../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { currentBaby } = useBaby();
  const navigation = useNavigation<Nav>();

  const user = DEMO_USER_DATA;

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  }

  function handleSubscription() {
    navigation.navigate('Subscription');
  }

  function handleShare() {
    if (currentBaby) {
      navigation.navigate('Share', { babyId: currentBaby.id });
    }
  }

  // Mock action stats
  const stats = { feeds: 20, diapers: 15, plays: 12 };
  const total = stats.feeds + stats.diapers + stats.plays;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.screenTitle}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.display_name[0]}</Text>
          </View>
          <View>
            <Text style={styles.displayName}>{user.display_name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Baby Card */}
        {currentBaby && (
          <View style={styles.babyCard}>
            <View style={styles.babyLeft}>
              {currentBaby.image_url ? (
                <Image source={{ uri: currentBaby.image_url }} style={styles.babyImage} />
              ) : (
                <View style={[styles.babyImage, styles.babyImagePlaceholder]}>
                  <Text style={{ fontSize: 32 }}>👶</Text>
                </View>
              )}
            </View>
            <View style={styles.babyInfo}>
              <Text style={styles.babyName}>{currentBaby.name}</Text>
              <Text style={styles.babyMode}>
                {currentBaby.mode === 'solo' ? '🌟 Solo mode' : '💕 Partner mode'}
              </Text>
              <Text style={styles.babyCode}>
                Code: {currentBaby.sync_code || 'EMBER-1234'}
              </Text>
            </View>
          </View>
        )}

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Your Stats This Week</Text>
        <View style={styles.statsGrid}>
          <StatCard emoji="🍼" label="Feeds" value={stats.feeds} color={colors.actionFeed} />
          <StatCard emoji="🧷" label="Diapers" value={stats.diapers} color={colors.actionDiaper} />
          <StatCard emoji="🎮" label="Plays" value={stats.plays} color="#9090C8" />
        </View>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total actions</Text>
          <Text style={styles.totalValue}>{total} 🏆</Text>
        </View>

        {/* Actions Section */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionList}>
          <ProfileRow emoji="📤" label="Share Baby" onPress={handleShare} />
          <ProfileRow emoji="💳" label="Manage Subscription" onPress={handleSubscription} badge="FREE" />
          <ProfileRow emoji="🔑" label="Invite Partner" onPress={() => {}} />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Ember v1.0.0 · Demo Mode 🐣</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <View style={[scStyles.card, { borderColor: color + '44' }]}>
      <Text style={scStyles.emoji}>{emoji}</Text>
      <Text style={[scStyles.value, { color }]}>{value}</Text>
      <Text style={scStyles.label}>{label}</Text>
    </View>
  );
}

const scStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  emoji: { fontSize: 22, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  label: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
});

function ProfileRow({ emoji, label, onPress, badge }: {
  emoji: string; label: string; onPress: () => void; badge?: string;
}) {
  return (
    <TouchableOpacity style={prStyles.row} onPress={onPress} activeOpacity={0.8}>
      <Text style={prStyles.emoji}>{emoji}</Text>
      <Text style={prStyles.label}>{label}</Text>
      {badge && <View style={prStyles.badge}><Text style={prStyles.badgeText}>{badge}</Text></View>}
      <Text style={prStyles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const prStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emoji: { fontSize: 20, marginRight: 12 },
  label: { flex: 1, fontSize: 16, color: colors.text, fontWeight: '600' },
  badge: {
    backgroundColor: colors.primary + '22',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  arrow: { fontSize: 20, color: colors.textTertiary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 40 },
  screenTitle: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 24 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: colors.primary },
  displayName: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 2 },
  email: { fontSize: 14, color: colors.textSecondary },
  babyCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  babyLeft: {},
  babyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  babyImagePlaceholder: {
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  babyInfo: { flex: 1 },
  babyName: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 2 },
  babyMode: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  babyCode: { fontSize: 12, color: colors.textTertiary, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  totalCard: {
    backgroundColor: colors.primary + '11',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.primary },
  actionList: { marginBottom: 24 },
  signOutBtn: {
    backgroundColor: '#FF444422',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF444444',
    marginBottom: 24,
  },
  signOutText: { fontSize: 16, fontWeight: '700', color: '#FF4444' },
  version: { fontSize: 12, color: colors.textTertiary, textAlign: 'center' },
});
