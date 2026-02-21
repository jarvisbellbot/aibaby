/**
 * Baby Reveal Screen — Ember V2
 * THE most important moment in the app. Designed to make moms cry. 💕
 *
 * Sequence:
 * 1. Dark screen → "Your baby is almost here..." (2s)
 * 2. Blurred/hidden circle appears in center
 * 3. Overlay fades away over 3s (simulates blur clearing)
 * 4. Baby snaps into focus — spring scale 0 → 1.1 → 1.0
 * 5. Hearts burst from baby outward (6 hearts)
 * 6. Confetti rains down
 * 7. Glowing ring pulses around baby
 * 8. Text fades in: "Meet your baby ✨" then name area
 * 9. "I'm in love 💕" button appears
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ConfettiCannon from 'react-native-confetti-cannon';
import LottieView from 'lottie-react-native';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BabyReveal'>;

const { width, height } = Dimensions.get('window');
const BABY_SIZE = 240;

// 6 heart positions that burst outward from center
const HEART_POSITIONS = [
  { angle: 0, distance: 120 },    // right
  { angle: 60, distance: 110 },   // upper-right
  { angle: 120, distance: 115 },  // upper-left
  { angle: 180, distance: 120 },  // left
  { angle: 240, distance: 110 },  // lower-left
  { angle: 300, distance: 115 },  // lower-right
];

function polarToXY(angle: number, distance: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
  };
}

export default function BabyRevealScreen({ navigation, route }: Props) {
  const { babyImageUrl } = route.params;

  // ── Phase tracking ────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<
    'dark' | 'anticipation' | 'revealing' | 'revealed' | 'celebratingl'
  >('dark');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

  // ── Animation values ─────────────────────────────────────────────────────
  const darkOverlay = useRef(new Animated.Value(1)).current;           // 1=dark, 0=visible
  const anticipationText = useRef(new Animated.Value(0)).current;      // "Your baby is almost here..."
  const babyScale = useRef(new Animated.Value(0)).current;             // baby image scale
  const babyOpacity = useRef(new Animated.Value(0)).current;           // baby image opacity
  const blurOverlay = useRef(new Animated.Value(1)).current;           // white overlay that fades = "blur clearing"
  const glowScale = useRef(new Animated.Value(1)).current;             // pulsing glow ring
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;          // "Meet your baby ✨"
  const titleSlide = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;         // "I'm in love 💕"
  const buttonSlide = useRef(new Animated.Value(30)).current;

  // Heart burst animations
  const heartAnims = useRef(
    HEART_POSITIONS.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      x: new Animated.Value(0),
      y: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    runRevealSequence();
  }, []);

  async function runRevealSequence() {
    // Step 1: Brief dark screen — build anticipation
    setPhase('dark');
    await delay(500);

    // Step 2: "Your baby is almost here..." fades in
    setPhase('anticipation');
    Animated.timing(anticipationText, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    await delay(2200);

    // Step 3: Dark overlay lifts — reveal the blurred baby circle
    setPhase('revealing');
    Animated.timing(darkOverlay, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Show baby image under blur overlay
    Animated.timing(babyOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    await delay(400);

    // Step 4: "Blur" clears over 3 seconds (white overlay fades)
    Animated.timing(blurOverlay, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    await delay(2000);

    // Step 5: Baby springs into full focus (scale pop)
    Animated.spring(babyScale, {
      toValue: 1.1,
      tension: 80,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(babyScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });

    await delay(300);

    // Step 6: Hearts BURST outward
    setPhase('revealed');
    burstHearts();

    // Step 7: Glow ring appears and pulses
    Animated.timing(glowOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    startGlowPulse();

    await delay(400);

    // Step 8: Confetti rains!
    setShowConfetti(true);
    setTimeout(() => {
      confettiRef.current?.start?.();
    }, 50);

    await delay(600);

    // Step 9: Title fades in — "Meet your baby ✨"
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(titleSlide, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    await delay(1000);

    // Step 10: Button appears
    setPhase('celebratingl');
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonSlide, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function burstHearts() {
    heartAnims.forEach((heart, i) => {
      const { x, y } = polarToXY(
        HEART_POSITIONS[i].angle,
        HEART_POSITIONS[i].distance
      );
      const delay_ = i * 60;

      heart.x.setValue(0);
      heart.y.setValue(0);
      heart.scale.setValue(0);
      heart.opacity.setValue(0);

      setTimeout(() => {
        Animated.parallel([
          Animated.spring(heart.scale, {
            toValue: 1.2,
            tension: 100,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(heart.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(heart.x, {
            toValue: x,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(heart.y, {
            toValue: y,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Fade out hearts after burst
          Animated.timing(heart.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      }, delay_);
    });
  }

  function startGlowPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <View style={styles.container}>
      {/* Background gradient — dark to warm */}
      <LinearGradient
        colors={['#1a0a0f', '#2d0e1a', '#4a1428', '#8b2252']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Confetti cannon */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={120}
          origin={{ x: width / 2, y: -20 }}
          autoStart={true}
          fadeOut={true}
          colors={['#FFB6C1', '#FFD700', '#FF6B6B', '#98D8C8', '#E6E6FA', '#FFA07A']}
          explosionSpeed={400}
          fallSpeed={3000}
        />
      )}

      {/* Anticipation text */}
      <Animated.Text
        style={[
          styles.anticipationText,
          {
            opacity: anticipationText,
            transform: [
              {
                translateY: anticipationText.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Your baby is almost here... 🌟
      </Animated.Text>

      {/* Baby reveal area */}
      <View style={styles.babyArea}>
        {/* Burst hearts */}
        {heartAnims.map((heart, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.burstHeart,
              {
                opacity: heart.opacity,
                transform: [
                  { translateX: heart.x },
                  { translateY: heart.y },
                  { scale: heart.scale },
                ],
              },
            ]}
          >
            💕
          </Animated.Text>
        ))}

        {/* Glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Baby image container */}
        <Animated.View
          style={[
            styles.babyContainer,
            {
              opacity: babyOpacity,
              transform: [{ scale: babyScale }],
            },
          ]}
        >
          <Image
            source={{ uri: babyImageUrl }}
            style={styles.babyImage}
            resizeMode="cover"
          />

          {/* "Blur clearing" — white overlay that fades away */}
          <Animated.View
            style={[
              styles.blurOverlay,
              { opacity: blurOverlay },
            ]}
          />
        </Animated.View>
      </View>

      {/* "Meet your baby ✨" title */}
      <Animated.View
        style={[
          styles.titleWrap,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }],
          },
        ]}
      >
        <Text style={styles.title}>Meet your baby ✨</Text>
        <Text style={styles.subtitle}>
          Born from love. Made just for you.
        </Text>
      </Animated.View>

      {/* "I'm in love 💕" button */}
      <Animated.View
        style={[
          styles.buttonWrap,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.loveButton}
          onPress={() => navigation.navigate('Naming', { babyImageUrl })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E6E', '#FFA07A']}
            style={styles.loveButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.loveButtonText}>I'm in love 💕</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.buttonSubtext}>Give your baby a name →</Text>
      </Animated.View>

      {/* Dark overlay — covers everything until reveal */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.darkOverlay,
          { opacity: darkOverlay },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anticipationText: {
    position: 'absolute',
    top: height * 0.18,
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 32,
    letterSpacing: 0.3,
  },
  babyArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BABY_SIZE + 80,
    height: BABY_SIZE + 80,
    marginBottom: 32,
  },
  glowRing: {
    position: 'absolute',
    width: BABY_SIZE + 40,
    height: BABY_SIZE + 40,
    borderRadius: (BABY_SIZE + 40) / 2,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 16,
  },
  babyContainer: {
    width: BABY_SIZE,
    height: BABY_SIZE,
    borderRadius: BABY_SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  babyImage: {
    width: BABY_SIZE,
    height: BABY_SIZE,
    borderRadius: BABY_SIZE / 2,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 240, 245, 0.95)',
    borderRadius: BABY_SIZE / 2,
  },
  burstHeart: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 10,
  },
  titleWrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 100, 100, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 220, 230, 0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  buttonWrap: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  loveButton: {
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 14,
  },
  loveButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  loveButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 200, 210, 0.7)',
    fontWeight: '500',
  },
  darkOverlay: {
    backgroundColor: '#0d0508',
    zIndex: 5,
  },
});
