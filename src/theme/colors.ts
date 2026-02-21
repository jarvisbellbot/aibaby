/**
 * Ember Color System
 * Warm pastels — designed to feel like opening a gift
 */

export const colors = {
  // Primary gradients
  primary: {
    coral: '#FF6B6B',
    coralLight: '#FFA07A',
    gradient: ['#FF6B6B', '#FFA07A'] as const,
  },

  // Accent colors
  accent: {
    pink: '#FFB6C1',
    pinkLight: '#FFD1DC',
    mint: '#98D8C8',
    mintLight: '#B8E8D8',
    lavender: '#E6E6FA',
    lavenderLight: '#F0F0FF',
    peach: '#FFDAB9',
    rose: '#FFE4E1',
    sky: '#87CEEB',
    sunflower: '#FFD700',
  },

  // Backgrounds
  background: {
    cream: '#FFF5EE',
    white: '#FFFFFF',
    warmWhite: '#FFFAF5',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayLight: 'rgba(255, 255, 255, 0.9)',
  },

  // Text
  text: {
    primary: '#2D2D3A',
    secondary: '#6B6B80',
    tertiary: '#9B9BB0',
    light: '#FFFFFF',
    accent: '#FF6B6B',
    muted: '#B0B0C0',
  },

  // Semantic
  semantic: {
    success: '#98D8C8',
    warning: '#FFD700',
    error: '#FF6B6B',
    info: '#87CEEB',
  },

  // Borders & Shadows
  border: {
    light: '#F0E8E0',
    medium: '#E0D8D0',
    focus: '#FFB6C1',
  },

  // Baby mood colors
  mood: {
    happy: '#98D8C8',
    okay: '#FFD700',
    sad: '#FFB6C1',
    crying: '#FF6B6B',
  },

  // Action colors
  action: {
    feed: '#FFA07A',
    diaper: '#98D8C8',
    play: '#E6E6FA',
  },

  // Shadow
  shadow: {
    soft: 'rgba(255, 107, 107, 0.15)',
    medium: 'rgba(0, 0, 0, 0.08)',
    warm: 'rgba(255, 160, 122, 0.2)',
  },
} as const;

export type ColorTheme = typeof colors;
