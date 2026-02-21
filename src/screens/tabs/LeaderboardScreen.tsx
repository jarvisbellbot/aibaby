/**
 * Leaderboard Screen — Ember
 * Who's the best parent this week?
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LeaderboardEntry } from '../../types';
import { getLeaderboard } from '../../lib/baby-engine';
import { colors } from '../../theme/colors';

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Get babyId from context
  const babyId = '';

  useEffect(() => {
    if (!babyId) { setLoading(false); return; }
    getLeaderboard(babyId).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, [babyId]);

  function renderEntry({ item }: { item: LeaderboardEntry }) {
    return (
      <View style={styles.entry}>
        <Text style={styles.rank}>{RANK_EMOJIS[item.rank - 1] || `#${item.rank}`}</Text>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{item.display_name?.[0] || '?'}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{item.display_name}</Text>
          <Text style={styles.actions}>{item.total_actions} actions this week</Text>
        </View>
        <View style={styles.breakdown}>
          <Text style={styles.breakdownItem}>🍼{item.feeds}</Text>
          <Text style={styles.breakdownItem}>🧷{item.diapers}</Text>
          <Text style={styles.breakdownItem}>🎮{item.plays}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week 🏆</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : entries.length === 0 ? (
        <Text style={styles.empty}>No actions yet this week! Be the first 💪</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.user_id}
          renderItem={renderEntry}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', paddingTop: 60, paddingBottom: 16 },
  list: { padding: 16 },
  entry: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  rank: { fontSize: 24, width: 40 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  avatarPlaceholder: { backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 18, fontWeight: '700', color: colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  actions: { fontSize: 13, color: colors.textSecondary },
  breakdown: { flexDirection: 'row', gap: 8 },
  breakdownItem: { fontSize: 13 },
  loading: { textAlign: 'center', color: colors.textSecondary, marginTop: 60 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 60, padding: 32 },
});
