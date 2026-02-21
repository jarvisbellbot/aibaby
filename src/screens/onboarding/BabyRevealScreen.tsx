/**
 * Baby Reveal Screen — Ember
 * The magical moment — first look at your AI baby
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { ONBOARDING_COPY } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BabyReveal'>;

export default function BabyRevealScreen({ navigation, route }: Props) {
  const { babyImageUrl } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ONBOARDING_COPY.reveal.title}</Text>
      <Text style={styles.subtitle}>{ONBOARDING_COPY.reveal.subtitle}</Text>

      <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <Image source={{ uri: babyImageUrl }} style={styles.babyImage} />
      </Animated.View>

      <Button
        label="Name Your Baby 💕"
        onPress={() => navigation.navigate('Naming', { babyImageUrl })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40 },
  imageContainer: { width: 260, height: 260, borderRadius: 130, overflow: 'hidden', marginBottom: 48, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20 },
  babyImage: { width: '100%', height: '100%' },
});
