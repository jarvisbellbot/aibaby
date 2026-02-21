import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => (
  <View style={[badge.base, badge[variant]]}>
    <Text style={[badge.text, badge[`${variant}Text` as keyof typeof badge] as any]}>{label}</Text>
  </View>
);

const badge = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  default: { backgroundColor: colors.lavender },
  success: { backgroundColor: colors.mint },
  warning: { backgroundColor: '#FFD70040' },
  error: { backgroundColor: '#FF6B6B30' },
  info: { backgroundColor: '#87CEEB40' },
  text: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  defaultText: { color: colors.textSecondary },
  successText: { color: '#2D8A7A' },
  warningText: { color: '#8A7A00' },
  errorText: { color: colors.error },
  infoText: { color: '#2D6A8A' },
});
