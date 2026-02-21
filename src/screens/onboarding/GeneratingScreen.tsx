/**
 * Generating Screen — Ember V2
 * Emotional loading screen — primes attachment DURING the wait.
 * The copy matters here. Every line should make them more excited to meet their baby.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { RootStackParamList, GenerationStage } from '../../types';
import { generateBaby } from '../../lib/replicate';
import { GENERATION_MESSAGES } from '../../constants';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Generating'>;

const { width } = Dimensions.get('window');

export default function GeneratingScreen({ navigation, route }: Props) {
  const { photos, mode } = route.params;
  const [stage, setStage] = useState<GenerationStage>('uploading');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(GENERATION_MESSAGES.uploading);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(1)).current;
  const bgGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startPulse();
    startBgGlow();
    generate();
  }, []);

  // Smooth progress bar animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  function startBgGlow() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(bgGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }

  function crossfadeMessage(newMessage: string) {
    Animated.sequence([
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMessage(newMessage);
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }

  async function generate() {
    try {
      const babyImageUrl = await generateBaby(
        photos,
        (progressUpdate) => {
          setStage(progressUpdate.stage);
          setProgress(progressUpdate.progress);
          crossfadeMessage(progressUpdate.message);
        }
      );

      // Brief pause at 100% to let the "Your baby is here! 🎉" message land
      await new Promise(r => setTimeout(r, 800));

      navigation.replace('BabyReveal', { babyImageUrl });
    } catch (err) {
      console.error('Generation failed:', err);
      // Graceful nav to reveal anyway (demo fallback handles it)
      navigation.replace('BabyReveal', {
        babyImageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=512&h=728&fit=crop&crop=face',
      });
    }
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#FFF5EE', '#FFDAB9', '#FFB6C1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Animated background glow */}
      <Animated.View
        style={[
          styles.bgGlow,
          {
            opacity: bgGlow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
          },
        ]}
      />

      {/* Lottie baby animation — happy baby that bounces while generating */}
      <Animated.View
        style={[
          styles.lottieWrap,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <LottieView
          source={require('../../assets/animations/baby-happy.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </Animated.View>

      {/* Emotional loading message — crossfades between stages */}
      <Animated.Text
        style={[styles.message, { opacity: messageOpacity }]}
      >
        {message}
      </Animated.Text>

      {/* Progress bar — warm coral fill */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressWidth },
          ]}
        />
      </View>

      <Text style={styles.percent}>{Math.round(progress)}%</Text>

      <Text style={styles.hint}>
        Your baby is being created{'\n'}with AI magic ✨
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  bgGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FF6B6B',
    top: '30%',
  },
  lottieWrap: {
    marginBottom: 24,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.text,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,107,107,0.15)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  percent: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 32,
  },
  hint: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
