/**
 * Divider Component
 * Visual separator for content sections
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant = 'full' | 'inset' | 'middle';

interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  label?: string;
  thickness?: number;
  color?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'full',
  label,
  thickness = 1,
  color,
  style,
}) => {
  const colors = useThemeColors();
  const dividerColor = color ?? colors.border.default;

  const getVariantStyles = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        alignSelf: 'stretch',
      };
    }

    switch (variant) {
      case 'inset':
        return {
          marginLeft: spacing['4'],
        };
      case 'middle':
        return {
          marginHorizontal: spacing['4'],
        };
      default:
        return {};
    }
  };

  if (label) {
    return (
      <View style={[styles.labelContainer, style]}>
        <View
          style={[
            styles.line,
            { backgroundColor: dividerColor, height: thickness },
          ]}
        />
        <Text
          style={[
            styles.label,
            textStyles.caption,
            { color: colors.text.tertiary },
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.line,
            { backgroundColor: dividerColor, height: thickness },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        { backgroundColor: dividerColor },
        orientation === 'horizontal' && { height: thickness },
        orientation === 'vertical' && { width: thickness },
        getVariantStyles(),
        style,
      ]}
      accessibilityRole="separator"
    />
  );
};

// Spacer component for consistent spacing
interface SpacerProps {
  size?: keyof typeof spacing;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = '4',
  horizontal = false,
}) => {
  const spacingValue = spacing[size];

  return (
    <View
      style={
        horizontal
          ? { width: spacingValue }
          : { height: spacingValue }
      }
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
  },
  label: {
    paddingHorizontal: spacing['3'],
  },
});
