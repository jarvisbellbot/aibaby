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

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: 'primary' | 'secondary' | 'ghost' | 'danger'; // alias for variant
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant,
  style,
  size = 'md',
  loading = false,
  disabled = false,
  containerStyle,
  textStyle,
  fullWidth = false,
}) => {
  const resolvedVariant = variant || style || 'primary';

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 20 },
  };

  if (resolvedVariant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && btn.fullWidth, containerStyle, { marginBottom: 12 }]}
      >
        <LinearGradient
          colors={disabled ? ['#D0D0D0', '#C0C0C0'] : ['#FF6B6B', '#FFA07A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[btn.base, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[btn.primaryText, textStyle]}>{label}</Text>
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
        btn.base,
        sizeStyles[size],
        resolvedVariant === 'secondary' && btn.secondary,
        resolvedVariant === 'ghost' && btn.ghost,
        resolvedVariant === 'danger' && btn.danger,
        disabled && btn.disabled,
        fullWidth && btn.fullWidth,
        containerStyle,
        { marginBottom: 12 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={resolvedVariant === 'secondary' ? colors.primary : '#fff'} size="small" />
      ) : (
        <Text
          style={[
            resolvedVariant === 'secondary' ? btn.secondaryText : btn.primaryText,
            resolvedVariant === 'ghost' && btn.ghostText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const btn = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#FF4444',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: colors.textLight,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  ghostText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
});
