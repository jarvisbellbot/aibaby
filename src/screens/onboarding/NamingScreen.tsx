/**
 * Naming Screen — Ember
 * Name your baby
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Naming'>;

export default function NamingScreen({ navigation, route }: Props) {
  const { babyImageUrl } = route.params;
  const [name, setName] = useState('');
  const copy = ONBOARDING_COPY.naming;

  function handleNext() {
    if (!name.trim()) return;
    navigation.navigate('Tutorial', { babyName: name.trim(), babyImageUrl });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>

      <Input
        value={name}
        onChangeText={setName}
        placeholder="Enter a name..."
        autoFocus
        maxLength={20}
      />

      <Text style={styles.suggestionsLabel}>Quick picks:</Text>
      <View style={styles.suggestions}>
        {copy.suggestions.map(suggestion => (
          <TouchableOpacity
            key={suggestion}
            style={styles.chip}
            onPress={() => setName(suggestion)}
          >
            <Text style={styles.chipText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        label="That's the one! 🎉"
        onPress={handleNext}
        disabled={!name.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  suggestionsLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, marginTop: 8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40 },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 14, fontWeight: '600' },
});
