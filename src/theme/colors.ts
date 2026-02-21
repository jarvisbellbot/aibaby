/**
 * Ember Color System
 * Warm pastels — designed to feel like opening a gift
 * Flat exports for easy use: colors.background, colors.primary, etc.
 */

export const colors = {
  // Primary
  primary: '#FF6B6B',
  primaryLight: '#FFA07A',

  // Surfaces
  background: '#FFF5EE',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text
  text: '#2D2D3A',
  textSecondary: '#6B6B80',
  textTertiary: '#9B9BB0',
  textLight: '#FFFFFF',
  textAccent: '#FF6B6B',
  textMuted: '#B0B0C0',

  // Accents
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

  // Semantic
  success: '#98D8C8',
  warning: '#FFD700',
  error: '#FF6B6B',
  info: '#87CEEB',

  // Borders
  borderLight: '#F0E8E0',
  borderMedium: '#E0D8D0',
  borderFocus: '#FFB6C1',

  // Mood
  moodHappy: '#98D8C8',
  moodOkay: '#FFD700',
  moodSad: '#FFB6C1',
  moodCrying: '#FF6B6B',

  // Actions
  actionFeed: '#FFA07A',
  actionDiaper: '#98D8C8',
  actionPlay: '#E6E6FA',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(255, 255, 255, 0.9)',

  // Shadow (not valid React Native bg colors but kept for reference)
  shadowSoft: 'rgba(255, 107, 107, 0.15)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowWarm: 'rgba(255, 160, 122, 0.2)',
} as const;

export type ColorTheme = typeof colors;
