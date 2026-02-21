import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

interface HappinessMeterProps { happiness: number; showLabel?: boolean; }

export const HappinessMeter: React.FC<HappinessMeterProps> = ({ happiness, showLabel = true }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: happiness / 100, useNativeDriver: false, tension: 60, friction: 8 }).start();
  }, [happiness]);

  const getMood = () => {
    if (happiness >= 80) return { emoji: '😊', label: 'Happy', color: colors.mood.happy };
    if (happiness >= 50) return { emoji: '😐', label: 'Okay', color: colors.mood.okay };
    if (happiness >= 20) return { emoji: '😢', label: 'Sad', color: colors.mood.sad };
    return { emoji: '😭', label: 'Crying', color: colors.mood.crying };
  };

  const mood = getMood();
  const barColor = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [colors.mood.crying, colors.mood.okay, colors.mood.happy] });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.header}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
          <Text style={styles.percent}>{Math.round(happiness)}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), backgroundColor: barColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  emoji: { fontSize: 20, marginRight: 8 },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text.secondary },
  percent: { fontSize: 14, fontWeight: '700', color: colors.text.primary },
  track: { height: 12, backgroundColor: colors.border.light, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
});
