import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';

interface HappinessMeterProps {
  value?: number;
  happiness?: number;
  showLabel?: boolean;
}

export const HappinessMeter: React.FC<HappinessMeterProps> = ({ value, happiness, showLabel = true }) => {
  const level = value ?? happiness ?? 70;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: level / 100, useNativeDriver: false, tension: 60, friction: 8 }).start();
  }, [level]);

  const getMood = () => {
    if (level >= 80) return { emoji: '😊', label: 'Happy', color: colors.moodHappy };
    if (level >= 50) return { emoji: '😐', label: 'Okay', color: colors.moodOkay };
    if (level >= 20) return { emoji: '😢', label: 'Sad', color: colors.moodSad };
    return { emoji: '😭', label: 'Crying', color: colors.moodCrying };
  };

  const mood = getMood();
  const barColor = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [colors.moodCrying, colors.moodOkay, colors.moodHappy],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.header}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
          <Text style={styles.percent}>{Math.round(level)}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, {
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          backgroundColor: barColor,
        }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  emoji: { fontSize: 20, marginRight: 8 },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  percent: { fontSize: 14, fontWeight: '700', color: colors.text },
  track: { height: 12, backgroundColor: colors.borderLight, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
});
