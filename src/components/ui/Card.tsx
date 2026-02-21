import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'soft' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const paddings = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };

  return (
    <View
      style={[
        styles.base,
        { padding: paddings[padding] },
        variant === 'soft' && styles.soft,
        variant === 'bordered' && styles.bordered,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    backgroundColor: colors.background.warmWhite,
    shadowOpacity: 0.5,
  },
  bordered: {
    borderWidth: 1.5,
    borderColor: colors.border.light,
    shadowOpacity: 0,
    elevation: 0,
  },
});
