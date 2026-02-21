import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps { label: string; variant?: 'success' | 'warning' | 'error' | 'info' | 'default'; }

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => (
  <View style={[styles.base, styles[variant]]}>
    <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles] as any]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  default: { backgroundColor: colors.accent.lavender },
  success: { backgroundColor: colors.accent.mint },
  warning: { backgroundColor: colors.accent.sunflower + '40' },
  error: { backgroundColor: colors.primary.coral + '30' },
  info: { backgroundColor: colors.accent.sky + '40' },
  text: { fontSize: 11, fontWeight: '700', color: colors.text.secondary },
  defaultText: { color: colors.text.secondary },
  successText: { color: '#2D8A7A' },
  warningText: { color: '#8A7A00' },
  errorText: { color: colors.primary.coral },
  infoText: { color: '#2D6A8A' },
});
