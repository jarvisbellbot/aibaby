/**
 * Share Screen — Ember
 * Share your baby on social media
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert, Share,
} from 'react-native';
import * as ExpoSharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { useBaby } from '../context/BabyContext';
import { colors } from '../theme/colors';

const SHARE_PLATFORMS = [
  { id: 'instagram', emoji: '📸', label: 'Instagram', color: '#E1306C' },
  { id: 'tiktok', emoji: '🎵', label: 'TikTok', color: '#000000' },
  { id: 'whatsapp', emoji: '💬', label: 'WhatsApp', color: '#25D366' },
  { id: 'twitter', emoji: '🐦', label: 'Twitter / X', color: '#1DA1F2' },
  { id: 'imessage', emoji: '💙', label: 'iMessage', color: '#2196F3' },
];

export default function ShareScreen() {
  const navigation = useNavigation();
  const { currentBaby } = useBaby();
  const [shared, setShared] = useState<string | null>(null);

  async function handleShare(platform: string) {
    const babyName = currentBaby?.name ?? 'my baby';
    const message = `Meet ${babyName} on Ember! 👶🔥 An AI-generated baby I've been raising. Download the app: https://ember.app #EmberBaby`;

    try {
      setShared(platform);
      await Share.share({ message, title: `Meet ${babyName}!` });
      setTimeout(() => setShared(null), 2000);
    } catch (e) {
      setShared(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Share {currentBaby?.name ?? 'your baby'} 📤</Text>
        <Text style={styles.subtitle}>Show the world your AI baby!</Text>

        {/* Baby Preview */}
        <View style={styles.babyPreview}>
          {currentBaby?.image_url ? (
            <Image source={{ uri: currentBaby.image_url }} style={styles.babyImage} />
          ) : (
            <View style={[styles.babyImage, styles.babyPlaceholder]}>
              <Text style={{ fontSize: 60 }}>👶</Text>
            </View>
          )}
          <Text style={styles.babyName}>{currentBaby?.name ?? 'Your Baby'} 🔥</Text>
          <Text style={styles.babyTagline}>Raised on Ember · ember.app</Text>
        </View>

        {/* Platform buttons */}
        <Text style={styles.shareLabel}>Share on:</Text>
        <View style={styles.platformGrid}>
          {SHARE_PLATFORMS.map(platform => (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformBtn,
                { borderColor: platform.color + '44' },
                shared === platform.id && { backgroundColor: platform.color + '22' },
              ]}
              onPress={() => handleShare(platform.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.platformEmoji}>{platform.emoji}</Text>
              <Text style={[styles.platformLabel, { color: platform.color }]}>
                {platform.label}
              </Text>
              {shared === platform.id && <Text style={styles.sharedCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sync code */}
        {currentBaby?.sync_code && (
          <View style={styles.syncCard}>
            <Text style={styles.syncLabel}>Partner Sync Code</Text>
            <Text style={styles.syncCode}>{currentBaby.sync_code}</Text>
            <Text style={styles.syncHint}>Share this so your partner can join</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24, paddingTop: 16 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28 },
  babyPreview: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  babyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    overflow: 'hidden',
  },
  babyPlaceholder: {
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  babyName: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 4 },
  babyTagline: { fontSize: 13, color: colors.textTertiary },
  shareLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  platformGrid: { gap: 8, marginBottom: 24 },
  platformBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  platformEmoji: { fontSize: 20, marginRight: 12, width: 28 },
  platformLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  sharedCheck: { fontSize: 16, color: colors.success, fontWeight: '900' },
  syncCard: {
    backgroundColor: colors.primary + '11',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  syncLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  syncCode: { fontSize: 28, fontWeight: '900', color: colors.primary, letterSpacing: 3, marginBottom: 4 },
  syncHint: { fontSize: 12, color: colors.textTertiary },
});
