/**
 * Welcome Screen — Ember
 * First screen users see. Hero moment.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#FFB6C1', '#FFDAB9', '#FFF5EE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>🔥</Text>
          <Text style={styles.logoName}>ember</Text>
        </View>

        {/* Hero copy */}
        <Text style={styles.tagline}>Meet your{'\n'}AI baby 👶</Text>
        <Text style={styles.subtitle}>
          See what your future baby could look like — and raise them together.
        </Text>

        {/* Floating baby emojis */}
        <View style={styles.emojiRow}>
          {['👶', '🍼', '🧷', '🎮', '💕'].map((e, i) => (
            <Text key={i} style={styles.floatEmoji}>{e}</Text>
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.buttons}>
          <Button
            label="✨ Start Solo"
            onPress={() => navigation.navigate('ModeSelect')}
            size="lg"
            fullWidth
          />
          <Button
            label="💕 Start with Partner"
            onPress={() => navigation.navigate('ModeSelect')}
            variant="secondary"
            size="lg"
            fullWidth
          />
        </View>

        <Text style={styles.footer}>No account needed to try demo mode 🐣</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 8,
  },
  logoName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 50,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  floatEmoji: {
    fontSize: 28,
  },
  buttons: {
    width: '100%',
    gap: 4,
  },
  footer: {
    marginTop: 16,
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
