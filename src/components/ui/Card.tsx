import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

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
  const paddings = { none: 0, sm: 8, md: 16, lg: 24 };

  return (
    <View
      style={[
        card.base,
        { padding: paddings[padding] },
        variant === 'soft' && card.soft,
        variant === 'bordered' && card.bordered,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const card = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    backgroundColor: colors.background,
    shadowOpacity: 0.04,
  },
  bordered: {
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
});
