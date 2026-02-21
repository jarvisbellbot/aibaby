import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const sizeStyles = {
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 12 },
    md: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, borderRadius: 16 },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: 20 },
  };

  const textSizes = {
    sm: typography.body.sm,
    md: typography.body.md,
    lg: typography.body.lg,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={disabled ? ['#D0D0D0', '#C0C0C0'] : ['#FF6B6B', '#FFA07A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.primaryText, textSizes[size], textStyle]}>{label}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        sizeStyles[size],
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary.coral : '#fff'} size="small" />
      ) : (
        <Text
          style={[
            variant === 'secondary' ? styles.secondaryText : styles.primaryText,
            variant === 'ghost' && styles.ghostText,
            textSizes[size],
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.warm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  fullWidth: { width: '100%' },
  secondary: {
    backgroundColor: colors.background.white,
    borderWidth: 2,
    borderColor: colors.primary.coral,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: '#FF4444',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  primaryText: {
    color: colors.text.light,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: colors.primary.coral,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ghostText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
});
