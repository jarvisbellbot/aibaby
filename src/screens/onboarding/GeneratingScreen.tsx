/**
 * Generating Screen — Ember
 * AI baby generation with animated progress
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, GenerationStage } from '../../types';
import { generateBaby } from '../../lib/replicate';
import { GENERATION_MESSAGES } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Generating'>;

export default function GeneratingScreen({ navigation, route }: Props) {
  const { photos, mode } = route.params;
  const [stage, setStage] = useState<GenerationStage>('uploading');
  const [progress, setProgress] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    startPulse();
    generate();
  }, []);

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }

  async function generate() {
    try {
      const stages: GenerationStage[] = ['uploading', 'analyzing', 'mixing', 'generating', 'finishing'];
      for (let i = 0; i < stages.length; i++) {
        setStage(stages[i]);
        setProgress(((i + 1) / stages.length) * 90);
        await new Promise(r => setTimeout(r, 2000));
      }

      const babyImageUrl = await generateBaby(photos);
      setProgress(100);
      setTimeout(() => {
        navigation.replace('BabyReveal', { babyImageUrl });
      }, 500);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}>
        👶
      </Animated.Text>
      <Text style={styles.message}>{GENERATION_MESSAGES[stage]}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.percent}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  emoji: { fontSize: 80, marginBottom: 32 },
  message: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 40, color: colors.text },
  progressBar: { width: '100%', height: 8, backgroundColor: colors.surface, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  percent: { fontSize: 14, color: colors.textSecondary },
});
