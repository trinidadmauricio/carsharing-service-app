/**
 * Button Component
 * Versatile button with multiple variants and states
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius, semanticSpacing } from '@/theme/spacing';
import { getShadow } from '@/theme/shadows';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  title,
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...pressableProps
}) => {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  // Support both title and children props
  const displayText = title || (typeof children === 'string' ? children : 'Button');

  const getVariantStyles = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {};

    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = pressed
          ? colors.interactive.primaryPressed
          : colors.interactive.primary;
        if (!pressed) Object.assign(baseStyle, getShadow('sm'));
        break;

      case 'secondary':
        baseStyle.backgroundColor = pressed
          ? colors.interactive.secondaryHover
          : colors.interactive.secondary;
        if (!pressed) Object.assign(baseStyle, getShadow('sm'));
        break;

      case 'outline':
        baseStyle.backgroundColor = pressed
          ? colors.background.secondary
          : 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = colors.interactive.primary;
        break;

      case 'ghost':
        baseStyle.backgroundColor = pressed
          ? colors.background.secondary
          : 'transparent';
        break;

      case 'danger':
        baseStyle.backgroundColor = pressed
          ? colors.interactive.dangerHover
          : colors.interactive.danger;
        if (!pressed) Object.assign(baseStyle, getShadow('sm'));
        break;
    }

    if (isDisabled) {
      baseStyle.backgroundColor = colors.interactive.primaryDisabled;
      baseStyle.borderColor = colors.interactive.primaryDisabled;
    }

    return baseStyle;
  };

  const getTextColor = (): string => {
    if (isDisabled) return colors.text.tertiary;

    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.interactive.primary;
      default:
        return colors.text.inverse;
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing['2'],
            paddingHorizontal: spacing['4'],
            minHeight: 36,
          },
          text: textStyles.buttonSmall,
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing['4'],
            paddingHorizontal: spacing['8'],
            minHeight: 56,
          },
          text: textStyles.buttonLarge,
        };
      default:
        return {
          container: {
            paddingVertical: spacing['3'],
            paddingHorizontal: spacing['6'],
            minHeight: 48,
          },
          text: textStyles.buttonMedium,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      {...pressableProps}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={displayText}
      style={({ pressed }) => [
        styles.base,
        sizeStyles.container,
        getVariantStyles(pressed),
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          accessibilityLabel="Loading"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              sizeStyles.text,
              { color: getTextColor() },
              leftIcon ? styles.textWithLeftIcon : undefined,
              rightIcon ? styles.textWithRightIcon : undefined,
              textStyle,
            ]}
          >
            {displayText}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    gap: spacing['2'],
  },
  fullWidth: {
    width: '100%',
  },
  textWithLeftIcon: {
    marginLeft: spacing['1'],
  },
  textWithRightIcon: {
    marginRight: spacing['1'],
  },
});
