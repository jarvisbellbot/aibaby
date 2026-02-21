/**
 * Mode Select Screen — Ember
 * Solo vs Partner mode
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelect'>;

export default function ModeSelectScreen({ navigation }: Props) {
  const { modeSelect } = ONBOARDING_COPY;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{modeSelect.title}</Text>
      <Text style={styles.subtitle}>{modeSelect.subtitle}</Text>

      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PhotoUpload', { mode: 'solo' })}
        >
          <Text style={styles.cardEmoji}>{modeSelect.solo.emoji}</Text>
          <Text style={styles.cardTitle}>{modeSelect.solo.title}</Text>
          <Text style={styles.cardSubtitle}>{modeSelect.solo.subtitle}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PhotoUpload', { mode: 'partner' })}
        >
          <Text style={styles.cardEmoji}>{modeSelect.partner.emoji}</Text>
          <Text style={styles.cardTitle}>{modeSelect.partner.title}</Text>
          <Text style={styles.cardSubtitle}>{modeSelect.partner.subtitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 48 },
  cards: { flexDirection: 'row', gap: 16 },
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: 20, padding: 24, alignItems: 'center' },
  cardEmoji: { fontSize: 40, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
