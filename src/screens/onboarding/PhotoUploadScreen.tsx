/**
 * Photo Upload Screen — Ember
 * Upload 1-2 photos for AI baby generation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoUpload'>;

export default function PhotoUploadScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const [photos, setPhotos] = useState<string[]>([]);
  const copy = ONBOARDING_COPY.photoUpload;

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri].slice(0, 2));
    }
  }

  function handleNext() {
    if (photos.length === 0) return;
    if (mode === 'partner') {
      navigation.navigate('PartnerInvite', { mode });
    } else {
      navigation.navigate('Generating', { photos, mode });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>
      <Text style={styles.hint}>{copy.hint}</Text>

      <View style={styles.photoGrid}>
        {[0, 1].map(i => (
          <TouchableOpacity key={i} style={styles.photoSlot} onPress={pickPhoto}>
            {photos[i] ? (
              <Image source={{ uri: photos[i] }} style={styles.photo} />
            ) : (
              <Text style={styles.plusIcon}>+</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Button
        label="Generate My Baby 🔥"
        onPress={handleNext}
        disabled={photos.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  hint: { fontSize: 14, color: colors.textSecondary, marginBottom: 40 },
  photoGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  photoSlot: { width: 140, height: 140, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  plusIcon: { fontSize: 40, color: colors.textSecondary },
});
