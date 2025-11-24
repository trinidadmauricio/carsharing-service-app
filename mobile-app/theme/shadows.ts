/**
 * Shadow System
 * Elevation and shadow styles for iOS and Android
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// Shadow presets
export const shadows: Record<string, ShadowStyle> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },

  // Inner shadow effect (iOS only, simulated)
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 0, // Inner shadows don't work with elevation
  },
};

// Colored shadows for special effects
export const coloredShadows = {
  primary: {
    ...shadows.md,
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
  },

  success: {
    ...shadows.md,
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
  },

  error: {
    ...shadows.md,
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
  },

  warning: {
    ...shadows.md,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.3,
  },
};

// Helper function to get platform-specific shadow
export const getShadow = (size: keyof typeof shadows): ViewStyle => {
  const shadow = shadows[size];

  if (Platform.OS === 'android') {
    return { elevation: shadow.elevation };
  }

  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  };
};

export type ShadowSize = keyof typeof shadows;
