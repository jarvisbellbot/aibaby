/**
 * Ember Typography System
 * Rounded, playful but not childish
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Font families
  family: {
    regular: fontFamily,
    medium: fontFamily,
    bold: fontFamily,
  },

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    hero: 56,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // Preset styles
  presets: {
    hero: {
      fontSize: 48,
      fontWeight: '800' as const,
      letterSpacing: -1,
      lineHeight: 56,
    },
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    h2: {
      fontSize: 26,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
      lineHeight: 34,
    },
    h3: {
      fontSize: 22,
      fontWeight: '600' as const,
      letterSpacing: 0,
      lineHeight: 30,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      letterSpacing: 0,
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '500' as const,
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
      letterSpacing: 0.3,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      lineHeight: 22,
    },
    buttonSm: {
      fontSize: 14,
      fontWeight: '600' as const,
      letterSpacing: 0.3,
      lineHeight: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      lineHeight: 18,
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type Typography = typeof typography;
