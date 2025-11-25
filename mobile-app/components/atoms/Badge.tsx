/**
 * Badge Component
 * Status indicators and labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  label,
  children,
  icon,
  style,
  textStyle,
  dot = false,
}) => {
  const colors = useThemeColors();

  // Support both label and children props
  const displayText = label || children;

  const getVariantColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return {
          bg: colors.status.successBg,
          text: colors.status.success,
        };
      case 'warning':
        return {
          bg: colors.status.warningBg,
          text: colors.status.warning,
        };
      case 'error':
      case 'danger':
        return {
          bg: colors.status.errorBg,
          text: colors.status.error,
        };
      case 'info':
        return {
          bg: colors.status.infoBg,
          text: colors.status.info,
        };
      case 'primary':
        return {
          bg: colors.interactive.primary,
          text: colors.text.inverse,
        };
      default:
        return {
          bg: colors.background.tertiary,
          text: colors.text.secondary,
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; dot: ViewStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing['0.5'],
            paddingHorizontal: spacing['2'],
          },
          text: textStyles.labelSmall,
          dot: {
            width: 6,
            height: 6,
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing['2'],
            paddingHorizontal: spacing['4'],
          },
          text: textStyles.labelMedium,
          dot: {
            width: 10,
            height: 10,
          },
        };
      default:
        return {
          container: {
            paddingVertical: spacing['1'],
            paddingHorizontal: spacing['3'],
          },
          text: textStyles.labelSmall,
          dot: {
            width: 8,
            height: 8,
          },
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        { backgroundColor: variantColors.bg },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={typeof displayText === 'string' ? displayText : undefined}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            sizeStyles.dot,
            { backgroundColor: variantColors.text },
          ]}
        />
      )}
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          sizeStyles.text,
          { color: variantColors.text },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: spacing['1.5'],
  },
  icon: {
    marginRight: spacing['1'],
  },
  dot: {
    borderRadius: borderRadius.full,
  },
});
