/**
 * Profile Screen — Ember
 * User profile, subscription, settings
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../lib/auth';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Free Plan</Text>
          <Text style={styles.rowAction}>Upgrade → $3/mo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Baby</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Share Baby</Text>
          <Text style={styles.rowAction}>📤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Invite Partner</Text>
          <Text style={styles.rowAction}>💕</Text>
        </TouchableOpacity>
      </View>

      <Button label="Sign Out" onPress={signOut} style="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 24 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.primary },
  email: { fontSize: 16, color: colors.textSecondary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8 },
  rowLabel: { fontSize: 16 },
  rowAction: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});
