/**
 * Photo Upload Screen — Ember
 * Upload 1-3 photos for AI baby generation
 * DEMO MODE: Skip button uses placeholder URLs
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { DEMO_MODE } from '../../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoUpload'>;

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=512&h=512&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=512&h=512&fit=crop',
];

export default function PhotoUploadScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const [photos, setPhotos] = useState<string[]>([]);

  async function pickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload your photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri].slice(0, 3));
    }
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }

  function handleGenerate() {
    if (mode === 'partner') {
      navigation.navigate('PartnerInvite', { mode });
    } else {
      navigation.navigate('Generating', { photos, mode });
    }
  }

  function handleDemoSkip() {
    navigation.navigate('Generating', { photos: DEMO_PHOTOS, mode });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Text style={styles.emoji}>📸</Text>
        <Text style={styles.title}>Let's see those{'\n'}good genes</Text>
        <Text style={styles.subtitle}>
          {mode === 'partner'
            ? 'Upload your photo — your partner will add theirs after.'
            : 'Upload 1-3 clear photos of your face'}
        </Text>
        <Text style={styles.hint}>💡 Good lighting + front-facing works best</Text>

        {/* Photo Grid */}
        <View style={styles.grid}>
          {[0, 1, 2].map(i => (
            <TouchableOpacity
              key={i}
              style={[styles.slot, photos[i] && styles.slotFilled]}
              onPress={() => photos[i] ? removePhoto(i) : pickPhoto()}
              activeOpacity={0.8}
            >
              {photos[i] ? (
                <>
                  <Image source={{ uri: photos[i] }} style={styles.photo} />
                  <View style={styles.removeOverlay}>
                    <Text style={styles.removeText}>✕</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.plusIcon}>+</Text>
                  <Text style={styles.slotLabel}>Photo {i + 1}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.photoCount}>{photos.length}/3 photos added</Text>

        {/* Generate button */}
        <Button
          label="Generate My Baby 🔥"
          onPress={handleGenerate}
          disabled={photos.length === 0}
          size="lg"
          fullWidth
        />

        {/* Demo skip button */}
        {DEMO_MODE && (
          <Button
            label="⚡ Skip — Use Demo Photos"
            onPress={handleDemoSkip}
            variant="ghost"
            fullWidth
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    alignItems: 'center',
    padding: 28,
    paddingTop: 40,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
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
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  hint: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 36,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  slot: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: colors.primary,
  },
  photo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  removeOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  plusIcon: { fontSize: 28, color: colors.textMuted, marginBottom: 2 },
  slotLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  photoCount: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 28,
  },
});
