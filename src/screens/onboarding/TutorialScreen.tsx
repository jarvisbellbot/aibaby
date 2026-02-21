/**
 * Tutorial Screen — Ember
 * Quick walkthrough of feed/diaper/play
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

export default function TutorialScreen({ navigation, route }: Props) {
  const { babyName } = route.params;
  const [step, setStep] = useState(0);
  const steps = ONBOARDING_COPY.tutorial.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function handleNext() {
    if (isLast) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: current.color + '33' }]}>
      <Text style={styles.emoji}>{current.emoji}</Text>
      <Text style={styles.babyName}>{babyName} needs you! 💕</Text>
      <Text style={styles.title}>{current.title}</Text>
      <Text style={styles.subtitle}>{current.subtitle}</Text>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <Button
        label={isLast ? ONBOARDING_COPY.tutorial.cta : 'Next →'}
        onPress={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 80, marginBottom: 24 },
  babyName: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 48 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surface },
  dotActive: { backgroundColor: colors.primary, width: 24 },
});
