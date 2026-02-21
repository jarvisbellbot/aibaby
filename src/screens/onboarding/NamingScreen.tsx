/**
 * Naming Screen — Ember
 * Name your baby. Shows generated image.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView, SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button, Input } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';
import { DEMO_MODE } from '../../lib/supabase';
import { DEMO_BABY_DATA } from '../../context/BabyContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Naming'>;

export default function NamingScreen({ navigation, route }: Props) {
  const { babyImageUrl } = route.params;
  const [name, setName] = useState('');
  const copy = ONBOARDING_COPY.naming;

  function handleNext() {
    if (!name.trim()) return;
    // In demo mode, we don't save to Supabase — just navigate
    navigation.navigate('Tutorial', { babyName: name.trim(), babyImageUrl });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Baby preview */}
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: babyImageUrl }}
              style={styles.babyImage}
              resizeMode="cover"
            />
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>They're waiting for a name 💕</Text>
            </View>
          </View>

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter a name..."
            autoCapitalize="words"
            maxLength={20}
          />

          <Text style={styles.suggestionsLabel}>✨ Quick picks:</Text>
          <View style={styles.suggestions}>
            {copy.suggestions.map(suggestion => (
              <TouchableOpacity
                key={suggestion}
                style={[styles.chip, name === suggestion && styles.chipSelected]}
                onPress={() => setName(suggestion)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, name === suggestion && styles.chipTextSelected]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            label="That's the one! 🎉"
            onPress={handleNext}
            disabled={!name.trim()}
            size="lg"
            fullWidth
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  container: {
    alignItems: 'center',
    padding: 28,
    paddingTop: 32,
  },
  imageWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
  },
  babyImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  chipSelected: {
    backgroundColor: colors.primary + '22',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.primary,
  },
});
