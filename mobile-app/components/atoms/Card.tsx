/**
 * Card Component
 * Container component with shadow and border options
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { useThemeColors } from '@/theme';
import { spacing, borderRadius, borderWidth } from '@/theme/spacing';
import { getShadow, ShadowSize } from '@/theme/shadows';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardBaseProps {
  variant?: CardVariant;
  shadow?: ShadowSize;
  padding?: keyof typeof spacing;
  borderRadiusSize?: keyof typeof borderRadius;
  style?: ViewStyle;
  children: React.ReactNode;
}

interface PressableCardProps extends CardBaseProps {
  onPress: () => void;
  pressableProps?: Omit<PressableProps, 'onPress' | 'style'>;
}

interface StaticCardProps extends CardBaseProps {
  onPress?: never;
  pressableProps?: never;
}

type CardProps = PressableCardProps | StaticCardProps;

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  shadow = 'md',
  padding = '4',
  borderRadiusSize = 'xl',
  style,
  children,
  onPress,
  pressableProps,
}) => {
  const colors = useThemeColors();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background.primary,
          ...getShadow(shadow),
        };
      case 'outlined':
        return {
          backgroundColor: colors.background.primary,
          borderWidth: borderWidth.thin,
          borderColor: colors.border.default,
        };
      case 'filled':
        return {
          backgroundColor: colors.background.secondary,
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    padding: spacing[padding],
    borderRadius: borderRadius[borderRadiusSize],
    ...getVariantStyles(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        {...pressableProps}
        style={({ pressed }) => [
          styles.base,
          cardStyle,
          pressed && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.base, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
