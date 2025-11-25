/**
 * Dark Mode Configuration
 * Theme switching utilities and dark mode specific styles
 */

import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';

export type ColorScheme = 'light' | 'dark';

// Theme context type
export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

// Get theme based on color scheme
export const getTheme = (colorScheme: ColorScheme): Theme => ({
  colors: (colorScheme === 'dark' ? darkColors : lightColors) as ThemeColors,
  isDark: colorScheme === 'dark',
});

// Custom hook to get current theme
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return getTheme(colorScheme ?? 'light');
};

// Custom hook to get theme colors
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};

// Light theme
export const lightTheme: Theme = {
  colors: lightColors as ThemeColors,
  isDark: false,
};

// Dark theme
export const darkTheme: Theme = {
  colors: darkColors as unknown as ThemeColors,
  isDark: true,
};

// Status bar style based on theme
export const getStatusBarStyle = (isDark: boolean): 'light-content' | 'dark-content' => {
  return isDark ? 'light-content' : 'dark-content';
};

// Navigation theme for React Navigation compatibility
export const getNavigationTheme = (isDark: boolean) => ({
  dark: isDark,
  colors: {
    primary: isDark ? darkColors.interactive.primary : lightColors.interactive.primary,
    background: isDark ? darkColors.background.primary : lightColors.background.primary,
    card: isDark ? darkColors.background.secondary : lightColors.background.secondary,
    text: isDark ? darkColors.text.primary : lightColors.text.primary,
    border: isDark ? darkColors.border.default : lightColors.border.default,
    notification: isDark ? darkColors.status.error : lightColors.status.error,
  },
});
