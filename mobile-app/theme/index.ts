/**
 * Theme Index
 * Centralized theme exports
 */

// Colors
export { palette, lightColors, darkColors } from './colors';
export type { Palette, ThemeColors } from './colors';

// Typography
export {
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  textStyles,
} from './typography';
export type { FontSize, FontWeight, TextStyleName } from './typography';

// Spacing
export {
  spacing,
  semanticSpacing,
  borderRadius,
  borderWidth,
} from './spacing';
export type { SpacingKey, BorderRadiusKey } from './spacing';

// Shadows
export { shadows, coloredShadows, getShadow } from './shadows';
export type { ShadowSize } from './shadows';

// Dark Mode
export {
  useTheme,
  useThemeColors,
  getTheme,
  lightTheme,
  darkTheme,
  getStatusBarStyle,
  getNavigationTheme,
} from './darkMode';
export type { Theme, ColorScheme } from './darkMode';

// Legacy tokens export for backwards compatibility
export { tokens } from './tokens';
