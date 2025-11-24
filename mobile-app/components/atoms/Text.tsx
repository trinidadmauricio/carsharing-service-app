/**
 * Text Component
 * Typography component with theme-aware styling
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles, TextStyleName } from '@/theme/typography';

type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'error' | 'success';

interface TextProps extends RNTextProps {
  variant?: TextStyleName;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const colors = useThemeColors();

  const getColor = (): string => {
    switch (color) {
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'inverse':
        return colors.text.inverse;
      case 'link':
        return colors.text.link;
      case 'error':
        return colors.text.error;
      case 'success':
        return colors.text.success;
      default:
        return colors.text.primary;
    }
  };

  return (
    <RNText
      {...props}
      style={[
        textStyles[variant],
        { color: getColor(), textAlign: align },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

// Heading shortcuts
export const Heading: React.FC<Omit<TextProps, 'variant'> & { level: 1 | 2 | 3 | 4 }> = ({
  level,
  ...props
}) => {
  const variants: Record<1 | 2 | 3 | 4, TextStyleName> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
  };

  return <Text variant={variants[level]} {...props} />;
};

// Body text shortcuts
export const Body: React.FC<Omit<TextProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
  ...props
}) => {
  const variants: Record<'sm' | 'md' | 'lg', TextStyleName> = {
    sm: 'bodySmall',
    md: 'bodyMedium',
    lg: 'bodyLarge',
  };

  return <Text variant={variants[size]} {...props} />;
};

// Label text shortcut
export const Label: React.FC<Omit<TextProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
  ...props
}) => {
  const variants: Record<'sm' | 'md' | 'lg', TextStyleName> = {
    sm: 'labelSmall',
    md: 'labelMedium',
    lg: 'labelLarge',
  };

  return <Text variant={variants[size]} {...props} />;
};

// Caption text shortcut
export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  return <Text variant="caption" color="secondary" {...props} />;
};
