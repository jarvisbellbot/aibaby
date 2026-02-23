import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Animated, 
  StyleSheet, 
  Dimensions, 
  GestureResponderEvent,
  PanResponder
} from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { BabyEmotion } from '../types/baby';

const { width, height } = Dimensions.get('window');

interface BabyAvatarProps {
  babyName: string;
  emotion: BabyEmotion;
  aiFaceUrl: string | null;
  isSleeping: boolean;
  onTap: () => void;
  onLongPress: () => void;
}

// Animation assets mapping
const ANIMATION_ASSETS: Record<string, any> = {
  idle: require('../assets/animations/baby_idle.json'),
  breathing: require('../assets/animations/baby_breathing.json'),
  blink: require('../assets/animations/baby_blink.json'),
  happy: require('../assets/animations/baby_happy.json'),
  giggling: require('../assets/animations/baby_giggle.json'),
  crying: require('../assets/animations/baby_cry.json'),
  eating: require('../assets/animations/baby_eating.json'),
  sleeping: require('../assets/animations/baby_sleep.json'),
  playing: require('../assets/animations/baby_play.json'),
  surprised: require('../assets/animations/baby_surprised.json'),
  talking: require('../assets/animations/baby_talk.json'),
  cuddling: require('../assets/animations/baby_cuddle.json'),
  relieved: require('../assets/animations/baby_relief.json'),
  laughing: require('../assets/animations/baby_laugh.json'),
  waking: require('../assets/animations/baby_wake.json')
};

// Sound effects
const SOUND_ASSETS: Record<string, any> = {
  giggle: require('../assets/sounds/giggle.mp3'),
  coo: require('../assets/sounds/coo.mp3'),
  cry: require('../assets/sounds/soft_cry.mp3'),
  yawn: require('../assets/sounds/yawn.mp3'),
  suckle: require('../assets/sounds/suckle.mp3'),
  happy: require('../assets/sounds/happy_coo.mp3')
};

export const BabyAvatar: React.FC<BabyAvatarProps> = ({
  babyName,
  emotion,
  aiFaceUrl,
  isSleeping,
  onTap,
  onLongPress
}) => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [showHearts, setShowHearts] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const heartAnim = useRef(new Animated.Value(0)).current;
  const wobbleAnim = useRef(new Animated.Value(0)).current;

  // Breathing animation loop
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true
        })
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, []);

  // React to emotion changes
  useEffect(() => {
    const animation = getAnimationForEmotion(emotion, isSleeping);
    setCurrentAnimation(animation);
    
    // Play appropriate sound
    if (!isSleeping) {
      playEmotionSound(emotion);
    }
  }, [emotion, isSleeping]);

  // Random idle animations
  useEffect(() => {
    if (isSleeping) return;
    
    const idleInterval = setInterval(() => {
      const random = Math.random();
      
      if (random < 0.3) {
        // Random blink
        playOneShot('blink');
      } else if (random < 0.5) {
        // Random leg kick
        triggerWobble();
      }
    }, 4000);

    return () => clearInterval(idleInterval);
  }, [isSleeping]);

  const getAnimationForEmotion = (emotion: BabyEmotion, sleeping: boolean): string => {
    if (sleeping) return 'sleeping';
    
    const emotionMap: Record<BabyEmotion, string> = {
      joyful: 'happy',
      happy: 'happy',
      content: 'idle',
      curious: 'idle',
      tired: 'idle',
      hungry: 'idle',
      crying: 'crying',
      sad: 'crying',
      lonely: 'idle',
      uncomfortable: 'crying',
      sleeping: 'sleeping',
      surprised: 'surprised',
      excited: 'happy'
    };

    return emotionMap[emotion] || 'idle';
  };

  const playEmotionSound = async (emotion: BabyEmotion) => {
    const soundMap: Record<BabyEmotion, string | null> = {
      joyful: 'giggle',
      happy: 'happy',
      content: 'coo',
      curious: null,
      tired: 'yawn',
      hungry: null,
      crying: 'cry',
      sad: 'cry',
      lonely: null,
      uncomfortable: null,
      sleeping: null,
      surprised: null,
      excited: 'giggle'
    };

    const soundName = soundMap[emotion];
    if (soundName) {
      await playSound(soundName);
    }
  };

  const playSound = async (soundName: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        SOUND_ASSETS[soundName],
        { shouldPlay: true, volume: 0.6 }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };

  const playOneShot = (animationName: string) => {
    // Trigger a temporary overlay animation
    lottieRef.current?.play(0, 30);
  };

  const triggerWobble = () => {
    Animated.sequence([
      Animated.timing(wobbleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(wobbleAnim, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(wobbleAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const showHeartBurst = () => {
    setShowHearts(true);
    heartAnim.setValue(0);
    
    Animated.timing(heartAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      setTimeout(() => setShowHearts(false), 500);
    });
  };

  // Pan responder for gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => {
        // Touch started
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true
        }).start();
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        }).start();

        if (gestureState.dx < 10 && gestureState.dy < 10) {
          // It's a tap
          showHeartBurst();
          playSound('giggle');
          onTap();
        }
      }
    })
  ).current;

  // Interpolated animations
  const wobbleRotation = wobbleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg']
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Shadow/Bloom effect */}
      <View style={styles.shadowContainer}>
        <Animated.View 
          style={[
            styles.babyContainer,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, breatheAnim) },
                { rotate: wobbleRotation }
              ]
            }
          ]}
        >
          {/* AI Face Layer */}
          {aiFaceUrl && (
            <View style={styles.faceContainer}>
              <Animated.Image
                source={{ uri: aiFaceUrl }}
                style={styles.aiFace}
                resizeMode="cover"
              />
              
              {/* Face overlay for expressions */}
              <View style={styles.expressionOverlay}>
                <ExpressionOverlay emotion={emotion} />
              </View>
            </View>
          )}

          {/* Lottie Animation Layer */}
          <View style={styles.animationContainer}>
            <LottieView
              ref={lottieRef}
              source={ANIMATION_ASSETS[currentAnimation]}
              autoPlay
              loop
              style={styles.lottieAnimation}
              speed={isSleeping ? 0.5 : 1}
            />
          </View>

          {/* Sleeping Zzz indicator */}
          {isSleeping && <SleepingIndicator />}
        </Animated.View>
      </View>

      {/* Heart particles on happy interaction */}
      {showHearts && (
        <Animated.View
          style={[
            styles.heartsContainer,
            {
              opacity: heartAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0]
              }),
              transform: [{
                translateY: heartAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -100]
                })
              }]
            }
          ]}
        >
          <HeartParticles />
        </Animated.View>
      )}

      {/* Name tag */}
      <View style={styles.nameTag}>
        <Text style={styles.nameText}>{babyName}</Text>
      </View>
    </View>
  );
};

// Expression overlay component
const ExpressionOverlay: React.FC<{ emotion: BabyEmotion }> = ({ emotion }) => {
  // Subtle visual effects based on emotion
  const getOverlayStyle = () => {
    switch (emotion) {
      case 'crying':
        return { backgroundColor: 'rgba(100, 149, 237, 0.1)' };
      case 'happy':
      case 'joyful':
        return { backgroundColor: 'rgba(255, 215, 0, 0.1)' };
      case 'tired':
      case 'sleeping':
        return { backgroundColor: 'rgba(138, 43, 226, 0.1)' };
      default:
        return {};
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, getOverlayStyle()]} />
  );
};

// Sleeping indicator with floating Zzzs
const SleepingIndicator: React.FC = () => {
  const zAnim1 = useRef(new Animated.Value(0)).current;
  const zAnim2 = useRef(new Animated.Value(0)).current;
  const zAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateZ = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      );
    };

    animateZ(zAnim1, 0).start();
    animateZ(zAnim2, 700).start();
    animateZ(zAnim3, 1400).start();
  }, []);

  const renderZ = (anim: Animated.Value, size: number, x: number) => (
    <Animated.Text
      style={[
        styles.sleepZ,
        {
          fontSize: size,
          left: x,
          opacity: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0]
          }),
          transform: [{
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -40]
            })
          }, {
            translateX: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 15]
            })
          }]
        }
      ]}
    >
      Z
    </Animated.Text>
  );

  return (
    <View style={styles.sleepIndicator}>
      {renderZ(zAnim1, 20, 0)}
      {renderZ(zAnim2, 16, 20)}
      {renderZ(zAnim3, 12, 40)}
    </View>
  );
};

// Floating hearts component
const HeartParticles: React.FC = () => {
  return (
    <View style={styles.heartsRow}>
      {['💕', '💖', '💗', '💓', '💝'].map((heart, i) => (
        <Text 
          key={i} 
          style={[styles.heart, { 
            transform: [{ rotate: `${(i - 2) * 15}deg` }],
            fontSize: 20 + i * 3
          }]}
        >
          {heart}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowContainer: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  babyContainer: {
    width: 280,
    height: 350,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  faceContainer: {
    position: 'absolute',
    top: 40,
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    zIndex: 2,
    borderWidth: 3,
    borderColor: 'rgba(255, 182, 193, 0.5)',
  },
  aiFace: {
    width: '100%',
    height: '100%',
  },
  expressionOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  animationContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    zIndex: 1,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  sleepIndicator: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 60,
    height: 60,
    zIndex: 4,
  },
  sleepZ: {
    position: 'absolute',
    color: '#9B59B6',
    fontWeight: 'bold',
  },
  heartsContainer: {
    position: 'absolute',
    top: '30%',
    zIndex: 10,
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heart: {
    textShadowColor: 'rgba(255, 105, 180, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  nameTag: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFB6C1',
    letterSpacing: 1,
  }
});

export default BabyAvatar;
