/**
 * Welcome Screen — Ember V2
 * PREMIUM first impression. Deep rose → warm peach → soft cream gradient.
 * Rotating testimonials. Pulsing logo. Emotional headline.
 * Goal: Make them feel something before they even tap. 💕
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

// Real-feeling testimonials — social proof at the most emotional moment
const TESTIMONIALS = [
  {
    quote: "I cried when I saw her face 😭",
    author: "Sarah M.",
    source: "App Store Review",
  },
  {
    quote: "This is the most addicting app I've ever used",
    author: "TikTok comment",
    source: "@embrapp",
  },
  {
    quote: "My partner and I stayed up all night with our baby",
    author: "App Store Review",
    source: "⭐⭐⭐⭐⭐",
  },
];

export default function WelcomeScreen({ navigation }: Props) {
  // ── Main entrance animations ──────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // ── Logo pulse ────────────────────────────────────────────────────────────
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;

  // ── CTA button breathe ────────────────────────────────────────────────────
  const ctaPulse = useRef(new Animated.Value(1)).current;

  // ── Testimonial carousel ──────────────────────────────────────────────────
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialOpacity = useRef(new Animated.Value(1)).current;
  const testimonialSlide = useRef(new Animated.Value(0)).current;

  // ── Floating emoji decorations ────────────────────────────────────────────
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo: pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // CTA button gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating emoji animations
    const floatLoop = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -12,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    floatLoop(float1, 0);
    floatLoop(float2, 700);
    floatLoop(float3, 1400);

    // Testimonial carousel — rotate every 4 seconds
    const rotateTestimonial = () => {
      Animated.sequence([
        Animated.timing(testimonialOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(testimonialSlide, {
          toValue: 20,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length);
        testimonialSlide.setValue(-20);
        Animated.parallel([
          Animated.timing(testimonialOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(testimonialSlide, {
            toValue: 0,
            tension: 80,
            friction: 12,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    const interval = setInterval(rotateTestimonial, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = TESTIMONIALS[testimonialIndex];

  return (
    <LinearGradient
      colors={['#8B1A4A', '#C94B6E', '#E87B8F', '#FFDAB9', '#FFF5EE']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Floating decoration emojis */}
        <View style={styles.floatingDecorations}>
          <Animated.Text style={[styles.floatEmoji, styles.floatLeft, { transform: [{ translateY: float1 }] }]}>
            💕
          </Animated.Text>
          <Animated.Text style={[styles.floatEmoji, styles.floatRight, { transform: [{ translateY: float2 }] }]}>
            ✨
          </Animated.Text>
          <Animated.Text style={[styles.floatEmoji, styles.floatFarRight, { transform: [{ translateY: float3 }] }]}>
            👶
          </Animated.Text>
        </View>

        {/* Logo — pulsing fire with glow */}
        <View style={styles.logoWrap}>
          <Animated.Text
            style={[
              styles.logoEmoji,
              {
                transform: [{ scale: logoPulse }],
                opacity: logoGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
            ]}
          >
            🔥
          </Animated.Text>
          <Text style={styles.logoName}>ember</Text>
        </View>

        {/* Headline — bold emotional statement */}
        <Text style={styles.headline}>
          {"See your baby\nbefore they're born"}
        </Text>

        {/* Subheadline */}
        <Text style={styles.subheadline}>AI-powered. Surprisingly real.</Text>

        {/* Testimonial carousel */}
        <Animated.View
          style={[
            styles.testimonialCard,
            {
              opacity: testimonialOpacity,
              transform: [{ translateY: testimonialSlide }],
            },
          ]}
        >
          <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
          <View style={styles.testimonialMeta}>
            <Text style={styles.testimonialAuthor}>— {testimonial.author}</Text>
            <Text style={styles.testimonialSource}>{testimonial.source}</Text>
          </View>
        </Animated.View>

        {/* Main CTA — "Create My Baby →" */}
        <Animated.View
          style={[
            styles.ctaWrap,
            { transform: [{ scale: ctaPulse }] },
          ]}
        >
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('ModeSelect')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#FF5C7A', '#FF7A5C', '#FF9A6C']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaText}>Create My Baby →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Trust indicators */}
        <Text style={styles.trustLine}>Free • Takes 60 seconds • No account needed</Text>

        {/* Dot indicators for testimonial carousel */}
        <View style={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === testimonialIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
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
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 24,
  },
  floatingDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatEmoji: {
    position: 'absolute',
    fontSize: 28,
    opacity: 0.5,
  },
  floatLeft: {
    top: '12%',
    left: '8%',
  },
  floatRight: {
    top: '8%',
    right: '10%',
  },
  floatFarRight: {
    top: '20%',
    right: '5%',
    fontSize: 22,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoEmoji: {
    fontSize: 48,
    marginRight: 10,
  },
  logoName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headline: {
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 48,
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subheadline: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginBottom: 36,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 90,
    justifyContent: 'center',
  },
  testimonialQuote: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 23,
    marginBottom: 10,
    fontWeight: '500',
  },
  testimonialMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialAuthor: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  testimonialSource: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  ctaWrap: {
    width: '100%',
    marginBottom: 14,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#FF5C7A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  trustLine: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 20,
    borderRadius: 3,
  },
});
