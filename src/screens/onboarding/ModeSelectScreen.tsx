/**
 * Mode Select Screen — Ember
 * Solo vs Partner mode selection
 */

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelect'>;

const MODES = [
  {
    mode: 'solo' as const,
    emoji: '🌟',
    title: 'Solo',
    subtitle: 'Just me and my baby',
    desc: 'Upload your photo and we\'ll generate your unique AI baby.',
    gradient: ['#FFB6C1', '#FFDAB9'] as [string, string],
    accent: '#FF6B6B',
  },
  {
    mode: 'partner' as const,
    emoji: '💕',
    title: 'Together',
    subtitle: 'With someone special',
    desc: 'Both of you upload photos to create your baby together.',
    gradient: ['#E6E6FA', '#FFD1DC'] as [string, string],
    accent: '#9090C8',
  },
];

export default function ModeSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>How would you like{'\n'}to start? 🍼</Text>
        <Text style={styles.subtitle}>Choose your adventure</Text>

        <View style={styles.cards}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.mode}
              style={styles.cardWrap}
              onPress={() => navigation.navigate('PhotoUpload', { mode: m.mode })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={m.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.cardEmoji}>{m.emoji}</Text>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{m.title}</Text>
                <Text style={styles.cardSub}>{m.subtitle}</Text>
                <Text style={styles.cardDesc}>{m.desc}</Text>
                <View style={[styles.badge, { backgroundColor: m.accent + '22', borderColor: m.accent + '44' }]}>
                  <Text style={[styles.badgeText, { color: m.accent }]}>Select →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  cards: {
    width: '100%',
    gap: 16,
  },
  cardWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    padding: 28,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
