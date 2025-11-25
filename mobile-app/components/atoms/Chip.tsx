/**
 * Chip Component
 * Selectable tags and filters
 */

import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius, borderWidth } from '@/theme/spacing';

type ChipVariant = 'outlined' | 'filled';
type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'outlined',
  size = 'md',
  selected = false,
  disabled = false,
  onPress,
  onRemove,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const colors = useThemeColors();
  const isInteractive = !!onPress && !disabled;

  const getContainerStyles = (pressed: boolean): ViewStyle => {
    const baseStyles: ViewStyle = {};

    if (variant === 'outlined') {
      baseStyles.borderWidth = borderWidth.thin;
      if (selected) {
        baseStyles.backgroundColor = colors.interactive.primary;
        baseStyles.borderColor = colors.interactive.primary;
      } else {
        baseStyles.backgroundColor = pressed
          ? colors.background.secondary
          : 'transparent';
        baseStyles.borderColor = colors.border.default;
      }
    } else {
      // filled
      if (selected) {
        baseStyles.backgroundColor = pressed
          ? colors.interactive.primaryPressed
          : colors.interactive.primary;
      } else {
        baseStyles.backgroundColor = pressed
          ? colors.background.tertiary
          : colors.background.secondary;
      }
    }

    if (disabled) {
      baseStyles.backgroundColor = colors.background.secondary;
      baseStyles.borderColor = colors.border.default;
      baseStyles.opacity = 0.5;
    }

    return baseStyles;
  };

  const getTextColor = (): string => {
    if (disabled) return colors.text.tertiary;
    if (selected) return colors.text.inverse;
    return colors.text.primary;
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: spacing['1'],
            paddingHorizontal: spacing['2'],
            minHeight: 24,
          },
          text: textStyles.caption,
        };
      case 'lg':
        return {
          container: {
            paddingVertical: spacing['2.5'],
            paddingHorizontal: spacing['4'],
            minHeight: 40,
          },
          text: textStyles.labelMedium,
        };
      default:
        return {
          container: {
            paddingVertical: spacing['1.5'],
            paddingHorizontal: spacing['3'],
            minHeight: 32,
          },
          text: textStyles.labelSmall,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();

  const content = (pressed: boolean): React.ReactNode => (
    <>
      {leftIcon}
      <Text
        style={[
          sizeStyles.text,
          { color: textColor },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {rightIcon}
      {onRemove && !disabled && (
        <Pressable
          onPress={onRemove}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          hitSlop={8}
        >
          <Text style={[styles.removeIcon, { color: textColor }]}>×</Text>
        </Pressable>
      )}
    </>
  );

  if (isInteractive) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.container,
          sizeStyles.container,
          getContainerStyles(pressed),
          style,
        ]}
      >
        {({ pressed }) => content(pressed)}
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled
      style={[
        styles.container,
        sizeStyles.container,
        getContainerStyles(false),
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {content(false)}
    </Pressable>
  );
};

// ChipGroup for multiple selection
interface ChipGroupProps {
  chips: { id: string; label: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  multiple?: boolean;
  variant?: ChipVariant;
  size?: ChipSize;
  style?: ViewStyle;
  chipStyle?: ViewStyle;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  selectedIds,
  onSelectionChange,
  multiple = false,
  variant = 'outlined',
  size = 'md',
  style,
  chipStyle,
}) => {
  const handlePress = (id: string): void => {
    if (multiple) {
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        onSelectionChange([...selectedIds, id]);
      }
    } else {
      onSelectionChange(selectedIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <View style={[styles.groupContainer, style]}>
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          variant={variant}
          size={size}
          selected={selectedIds.includes(chip.id)}
          onPress={() => handlePress(chip.id)}
          style={chipStyle}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing['1.5'],
  },
  removeButton: {
    marginLeft: spacing['0.5'],
  },
  removeIcon: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
  },
  groupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
});
