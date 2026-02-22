/**
 * Leaderboard Screen — Ember
 * Weekly rankings with mock data
 */

import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { colors } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface LeaderboardRow {
  rank: number;
  display_name: string;
  total_actions: number;
  feeds: number;
  diapers: number;
  plays: number;
}

const DEMO_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, display_name: 'Joshua', total_actions: 47, feeds: 20, diapers: 15, plays: 12 },
  { rank: 2, display_name: 'Sophia', total_actions: 38, feeds: 16, diapers: 12, plays: 10 },
  { rank: 3, display_name: 'Marcus', total_actions: 29, feeds: 12, diapers: 9, plays: 8 },
  { rank: 4, display_name: 'Alex', total_actions: 21, feeds: 9, diapers: 7, plays: 5 },
  { rank: 5, display_name: 'Jordan', total_actions: 14, feeds: 6, diapers: 4, plays: 4 },
];

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

const AVATAR_COLORS = [
  '#FF6B6B', '#FFA07A', '#FFB6C1', '#98D8C8', '#E6E6FA', '#87CEEB',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + hash;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function LeaderRow({ item, isMe }: { item: LeaderboardRow; isMe: boolean }) {
  const avatarColor = getAvatarColor(item.display_name);

  return (
    <View style={[rowStyles.row, isMe && rowStyles.rowMe]}>
      {/* Rank */}
      <Text style={rowStyles.rank}>
        {item.rank <= 3 ? RANK_EMOJIS[item.rank - 1] : `#${item.rank}`}
      </Text>

      {/* Avatar */}
      <View style={[rowStyles.avatar, { backgroundColor: avatarColor + '33', borderColor: avatarColor }]}>
        <Text style={[rowStyles.avatarText, { color: avatarColor }]}>
          {item.display_name[0].toUpperCase()}
        </Text>
      </View>

      {/* Name + score */}
      <View style={rowStyles.info}>
        <Text style={rowStyles.name}>
          {item.display_name}{isMe ? ' (you)' : ''}
        </Text>
        <Text style={rowStyles.actions}>{item.total_actions} actions this week</Text>
      </View>

      {/* Breakdown */}
      <View style={rowStyles.breakdown}>
        <Text style={rowStyles.breakItem}>🍼 {item.feeds}</Text>
        <Text style={rowStyles.breakItem}>🧷 {item.diapers}</Text>
        <Text style={rowStyles.breakItem}>🎮 {item.plays}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rowMe: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  rank: { fontSize: 22, width: 40, textAlign: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  avatarText: { fontSize: 18, fontWeight: '800' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  actions: { fontSize: 13, color: colors.textSecondary },
  breakdown: { gap: 2, alignItems: 'flex-end' },
  breakItem: { fontSize: 12, color: colors.textSecondary },
});

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#FFB6C1', '#FFF5EE']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🏆 Weekly Rankings</Text>
        <Text style={styles.headerSub}>Feb 17 – Feb 23 · Demo data</Text>
      </LinearGradient>

      <FlashList
        data={DEMO_LEADERBOARD}
        keyExtractor={item => String(item.rank)}
        renderItem={({ item }) => (
          <LeaderRow item={item} isMe={item.display_name === 'Joshua'} />
        )}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌟 Actions reset every Monday. Keep caring for {'\n'}your baby to climb the rankings!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
