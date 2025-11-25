/**
 * Typography System
 * Font scales, weights, and text styles
 */

import { TextStyle, Platform } from 'react-native';

// Font family based on platform
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// Font sizes following a modular scale (1.25 ratio)
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
} as const;

// Font weights
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Line heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

// Pre-defined text styles
export const textStyles = {
  // Display styles for large headings
  displayLarge: {
    fontFamily,
    fontSize: fontSizes['6xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['6xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,

  displayMedium: {
    fontFamily,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,

  displaySmall: {
    fontFamily,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // Heading styles
  h1: {
    fontFamily,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h2: {
    fontFamily,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['2xl'] * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h3: {
    fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h4: {
    fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.lg * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Body styles
  bodyLarge: {
    fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodyMedium: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.md * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Label styles (for buttons, inputs, etc.)
  labelLarge: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  labelMedium: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  labelSmall: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  // Caption and helper text
  caption: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  overline: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  } as TextStyle,

  // Button text
  buttonLarge: {
    fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonMedium: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonSmall: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Legacy aliases for backward compatibility
  body1: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.md * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  body2: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
} as const;

export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type TextStyleName = keyof typeof textStyles;
