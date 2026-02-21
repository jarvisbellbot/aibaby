/**
 * Ember Spacing & Layout System
 * Consistent spacing for a polished feel
 */

export const spacing = {
  // Base spacing scale (4px increments)
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,

  // Screen padding
  screen: {
    horizontal: 24,
    vertical: 16,
    top: 60,
    bottom: 34,
  },

  // Card padding
  card: {
    padding: 20,
    paddingLg: 24,
    margin: 12,
    gap: 16,
  },

  // Button
  button: {
    paddingH: 24,
    paddingV: 16,
    paddingSmH: 16,
    paddingSmV: 10,
    gap: 8,
  },

  // Input
  input: {
    paddingH: 16,
    paddingV: 14,
    gap: 8,
  },

  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
} as const;

export type Spacing = typeof spacing;
