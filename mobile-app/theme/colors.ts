/**
 * Color Palette
 * Complete color system for light and dark modes
 */

export const palette = {
  // Primary - Brand color (Purple/Indigo)
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#667eea',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary - Accent color (Teal)
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Neutral - Gray scale
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic - Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Semantic - Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Semantic - Error
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Semantic - Info
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Additional color aliases
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Base colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Light theme semantic colors
export const lightColors = {
  // Backgrounds
  background: {
    primary: palette.white,
    secondary: palette.neutral[50],
    tertiary: palette.neutral[100],
    inverse: palette.neutral[900],
  },

  // Text
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    tertiary: palette.neutral[400],
    inverse: palette.white,
    link: palette.primary[600],
    error: palette.error[600],
    success: palette.success[600],
  },

  // Borders
  border: {
    default: palette.neutral[200],
    focus: palette.primary[500],
    error: palette.error[500],
    success: palette.success[500],
  },

  // Interactive
  interactive: {
    primary: palette.primary[500],
    primaryHover: palette.primary[600],
    primaryPressed: palette.primary[700],
    primaryDisabled: palette.primary[300],
    secondary: palette.secondary[500],
    secondaryHover: palette.secondary[600],
    danger: palette.error[500],
    dangerHover: palette.error[600],
  },

  // Status indicators
  status: {
    success: palette.success[500],
    successBg: palette.success[50],
    warning: palette.warning[500],
    warningBg: palette.warning[50],
    error: palette.error[500],
    errorBg: palette.error[50],
    info: palette.info[500],
    infoBg: palette.info[50],
  },

  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

// Dark theme semantic colors
export const darkColors = {
  // Backgrounds
  background: {
    primary: palette.neutral[900],
    secondary: palette.neutral[800],
    tertiary: palette.neutral[700],
    inverse: palette.white,
  },

  // Text
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[300],
    tertiary: palette.neutral[500],
    inverse: palette.neutral[900],
    link: palette.primary[400],
    error: palette.error[400],
    success: palette.success[400],
  },

  // Borders
  border: {
    default: palette.neutral[700],
    focus: palette.primary[400],
    error: palette.error[400],
    success: palette.success[400],
  },

  // Interactive
  interactive: {
    primary: palette.primary[500],
    primaryHover: palette.primary[400],
    primaryPressed: palette.primary[600],
    primaryDisabled: palette.neutral[600],
    secondary: palette.secondary[500],
    secondaryHover: palette.secondary[400],
    danger: palette.error[500],
    dangerHover: palette.error[400],
  },

  // Status indicators
  status: {
    success: palette.success[400],
    successBg: 'rgba(34, 197, 94, 0.15)',
    warning: palette.warning[400],
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: palette.error[400],
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: palette.info[400],
    infoBg: 'rgba(59, 130, 246, 0.15)',
  },

  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type Palette = typeof palette;
export type ThemeColors = typeof lightColors;
