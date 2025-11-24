/**
 * Input Component
 * Text input with validation states and icons
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius, borderWidth } from '@/theme/spacing';

type InputVariant = 'default' | 'filled';
type InputState = 'default' | 'focus' | 'error' | 'success' | 'disabled';

interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
  success?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      variant = 'default',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      required = false,
      success = false,
      editable = true,
      ...textInputProps
    },
    ref
  ) => {
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);

    const getState = (): InputState => {
      if (!editable) return 'disabled';
      if (error) return 'error';
      if (success) return 'success';
      if (isFocused) return 'focus';
      return 'default';
    };

    const state = getState();

    const getBorderColor = (): string => {
      switch (state) {
        case 'focus':
          return colors.border.focus;
        case 'error':
          return colors.border.error;
        case 'success':
          return colors.border.success;
        case 'disabled':
          return colors.border.default;
        default:
          return colors.border.default;
      }
    };

    const getBackgroundColor = (): string => {
      if (variant === 'filled') {
        return state === 'disabled'
          ? colors.background.tertiary
          : colors.background.secondary;
      }
      return state === 'disabled'
        ? colors.background.secondary
        : colors.background.primary;
    };

    const getLabelColor = (): string => {
      switch (state) {
        case 'error':
          return colors.text.error;
        case 'focus':
          return colors.interactive.primary;
        case 'disabled':
          return colors.text.tertiary;
        default:
          return colors.text.secondary;
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: getLabelColor() }]}>
              {label}
            </Text>
            {required && (
              <Text style={[styles.required, { color: colors.status.error }]}>
                *
              </Text>
            )}
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            variant === 'filled' && styles.inputContainerFilled,
            {
              borderColor: getBorderColor(),
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            {...textInputProps}
            editable={editable}
            onFocus={(e) => {
              setIsFocused(true);
              textInputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              textInputProps.onBlur?.(e);
            }}
            style={[
              styles.input,
              textStyles.bodyMedium,
              {
                color: editable ? colors.text.primary : colors.text.tertiary,
              },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              inputStyle,
            ]}
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel={label}
            accessibilityState={{
              disabled: !editable,
            }}
          />

          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              style={styles.rightIcon}
              disabled={!onRightIconPress}
              accessibilityRole={onRightIconPress ? 'button' : undefined}
            >
              {rightIcon}
            </Pressable>
          )}
        </View>

        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: error ? colors.text.error : colors.text.secondary },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: spacing['2'],
  },
  label: {
    ...textStyles.labelMedium,
  },
  required: {
    marginLeft: spacing['1'],
    ...textStyles.labelMedium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.thin,
    borderRadius: borderRadius.lg,
    minHeight: 48,
  },
  inputContainerFilled: {
    borderWidth: 0,
    borderBottomWidth: borderWidth.medium,
    borderRadius: 0,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
  },
  inputWithLeftIcon: {
    paddingLeft: spacing['2'],
  },
  inputWithRightIcon: {
    paddingRight: spacing['2'],
  },
  leftIcon: {
    paddingLeft: spacing['4'],
  },
  rightIcon: {
    paddingRight: spacing['4'],
  },
  helperText: {
    ...textStyles.caption,
    marginTop: spacing['1'],
    paddingHorizontal: spacing['1'],
  },
});
