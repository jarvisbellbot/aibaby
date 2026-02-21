/**
 * BabyAvatar — Ember V2
 * The living, breathing heart of the app.
 * AI photo babies: pulse with life. Emoji babies: always moving.
 * Mood-driven glow ring. Floating hearts on happy state.
 * This baby should NEVER sit still. 🐣
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../../theme/colors';

interface BabyAvatarProps {
  imageUrl?: string | null;
  size?: number;
  mood?: string;
  happiness?: number;
  name?: string;
}

// Mood → glow color mapping (rich, warm spectrum)
const MOOD_GLOW: Record<string, string> = {
  happy: '#98D8C8',   // soft mint — thriving
  okay: '#FFD700',    // warm gold — needs a little love
  sad: '#FFB6C1',     // blush — hurting
  crying: '#FF6B6B',  // coral red — urgent
};

// Floating heart positions (3 hearts at different x offsets)
const HEART_OFFSETS = [-30, 0, 30];

export const BabyAvatar: React.FC<BabyAvatarProps> = ({
  imageUrl,
  size = 180,
  mood = 'happy',
  happiness = 70,
  name,
}) => {
  // ── Breathing / scale pulse (AI photo mode) ──────────────────────────────
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // ── Glow ring pulse ───────────────────────────────────────────────────────
  const glowAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  // ── Floating hearts (3 hearts, each on its own timeline) ─────────────────
  const heartAnims = useRef(
    HEART_OFFSETS.map(() => ({
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // ── Emoji bounce (placeholder mode) ──────────────────────────────────────
  const emojiBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle breathing — 4s cycle, barely noticeable but alive
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow ring pulses with mood urgency
    const glowSpeed = mood === 'crying' ? 600 : mood === 'sad' ? 900 : 1400;
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowAnim, {
            toValue: 1.08,
            duration: glowSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: glowSpeed,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: glowSpeed,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: glowSpeed,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Emoji placeholder bounce
    Animated.loop(
      Animated.sequence([
        Animated.spring(emojiBounce, {
          toValue: 1.08,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(emojiBounce, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
      ])
    ).start();
  }, [mood]);

  // Start floating hearts when happy
  useEffect(() => {
    if (mood === 'happy') {
      heartAnims.forEach((heart, i) => {
        const startDelay = i * 600;
        const runHeart = () => {
          heart.y.setValue(0);
          heart.opacity.setValue(0);
          Animated.sequence([
            Animated.delay(startDelay),
            Animated.parallel([
              Animated.timing(heart.opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(heart.y, {
                toValue: -80,
                duration: 1800,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(heart.opacity, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Loop after a pause
            setTimeout(runHeart, 800 + i * 400);
          });
        };
        setTimeout(runHeart, startDelay);
      });
    } else {
      // Stop hearts when not happy
      heartAnims.forEach(heart => {
        heart.opacity.setValue(0);
      });
    }
  }, [mood]);

  const ringColor = MOOD_GLOW[mood] || MOOD_GLOW.happy;
  const ringSize = size + 20;

  return (
    <View style={styles.wrapper}>
      {/* Floating hearts — only visible when happy */}
      {mood === 'happy' && (
        <View style={[styles.heartsContainer, { width: size + 60, height: size + 60 }]}>
          {heartAnims.map((heart, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.floatingHeart,
                {
                  left: (size + 60) / 2 + HEART_OFFSETS[i] - 10,
                  bottom: size / 2 - 10,
                  opacity: heart.opacity,
                  transform: [{ translateY: heart.y }],
                },
              ]}
            >
              💕
            </Animated.Text>
          ))}
        </View>
      )}

      {/* Outer glow ring — mood-colored, pulsing */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: ringSize + 16,
            height: ringSize + 16,
            borderRadius: (ringSize + 16) / 2,
            borderColor: ringColor,
            shadowColor: ringColor,
            transform: [{ scale: glowAnim }],
            opacity: glowOpacity,
          },
        ]}
      />

      {/* Inner ring + avatar — breathes with baby */}
      <Animated.View
        style={[
          styles.innerRing,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderColor: ringColor + '88',
            transform: [{ scale: breatheAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ) : (
            // Placeholder: Lottie animation or bouncing emoji fallback
            <Animated.View
              style={[
                styles.placeholderContainer,
                { transform: [{ scale: emojiBounce }] },
              ]}
            >
              <LottieView
                source={require('../../assets/animations/baby-happy.json')}
                autoPlay
                loop
                style={{ width: size * 0.85, height: size * 0.85 }}
              />
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* Baby name */}
      {name && <Text style={styles.name}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
    pointerEvents: 'none',
  },
  floatingHeart: {
    position: 'absolute',
    fontSize: 18,
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  innerRing: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  avatar: {
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
});
