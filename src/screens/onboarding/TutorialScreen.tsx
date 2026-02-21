/**
 * Tutorial Screen — Ember
 * 3-slide swipeable tutorial
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Button } from '../../components/ui';
import { colors } from '../../theme/colors';
import { useBaby, DEMO_BABY_DATA } from '../../context/BabyContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🍼',
    title: 'Feed your baby',
    subtitle: 'Keep them happy!',
    desc: 'Your baby gets hungry every 30 minutes. Tap Feed to keep their tummy full and mood high.',
    gradient: ['#FFE0CC', '#FFF5EE'] as [string, string],
    color: colors.actionFeed,
  },
  {
    emoji: '🧷',
    title: 'Change diapers',
    subtitle: 'Cleanliness matters!',
    desc: 'A clean baby is a happy baby. Change their diaper regularly to keep their spirits up.',
    gradient: ['#CCF0E8', '#F0FFF8'] as [string, string],
    color: colors.actionDiaper,
  },
  {
    emoji: '🎮',
    title: 'Play together',
    subtitle: 'Fun keeps them thriving!',
    desc: 'Playtime boosts mood the most! Play with your baby every 15 minutes for max happiness.',
    gradient: ['#E8E0FF', '#F5F0FF'] as [string, string],
    color: '#9090C8',
  },
];

export default function TutorialScreen({ navigation, route }: Props) {
  const { babyName } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { setBaby } = useBaby();

  function goToSlide(index: number) {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  }

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleFinish();
    }
  }

  function handleFinish() {
    // Set the named baby in context
    const namedBaby = {
      ...DEMO_BABY_DATA,
      name: babyName,
      image_url: route.params.babyImageUrl,
    };
    setBaby(namedBaby);

    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <LinearGradient
            key={index}
            colors={slide.gradient}
            style={styles.slide}
          >
            <Text style={styles.babyName}>{babyName} needs you! 💕</Text>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={[styles.slideTitle, { color: slide.color }]}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            <View style={styles.descBox}>
              <Text style={styles.slideDesc}>{slide.desc}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
              <View style={[styles.dot, i === currentIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          {currentIndex > 0 && (
            <Button
              label="← Back"
              onPress={() => goToSlide(currentIndex - 1)}
              variant="ghost"
              containerStyle={styles.backBtn}
            />
          )}
          <Button
            label={isLast ? `Meet ${babyName}! 🔥` : 'Next →'}
            onPress={handleNext}
            containerStyle={styles.nextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  babyName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    fontWeight: '600',
  },
  slideEmoji: {
    fontSize: 88,
    marginBottom: 24,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  descBox: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 20,
    maxWidth: 300,
  },
  slideDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  controls: {
    paddingHorizontal: 28,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderMedium,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backBtn: {
    flex: 0,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  nextBtn: {
    flex: 1,
    marginBottom: 0,
  },
});
