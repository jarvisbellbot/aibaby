import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { colors } from '../../theme/colors';

interface ActionButtonProps {
  type?: 'feed' | 'diaper' | 'play';
  action?: 'feed' | 'diaper' | 'play';
  onPress: () => void;
  disabled?: boolean;
  cooldownRemaining?: number;
}

const ACTION_CONFIG = {
  feed: { emoji: '🍼', label: 'Feed', color: colors.actionFeed, bg: '#FFF0E8' },
  diaper: { emoji: '🧷', label: 'Diaper', color: colors.actionDiaper, bg: '#E8F8F5' },
  play: { emoji: '🎮', label: 'Play', color: '#9090C8', bg: '#F0F0FF' },
};

export const ActionButton: React.FC<ActionButtonProps> = ({ type, action, onPress, disabled, cooldownRemaining }) => {
  const key = type || action || 'feed';
  const scale = useRef(new Animated.Value(1)).current;
  const config = ACTION_CONFIG[key];

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, tension: 300 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300 }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.btn, { backgroundColor: config.bg }, disabled && styles.disabled]}
        activeOpacity={0.8}
      >
        <Text style={styles.emoji}>{config.emoji}</Text>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        {cooldownRemaining ? <Text style={styles.cooldown}>{cooldownRemaining}m</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center', justifyContent: 'center',
    width: 90, height: 90, borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  emoji: { fontSize: 28, marginBottom: 4 },
  label: { fontSize: 12, fontWeight: '700' },
  cooldown: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  disabled: { opacity: 0.5 },
});
