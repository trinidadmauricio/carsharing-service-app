/**
 * PinInput Component
 * 6-digit PIN input for phone verification
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { Text } from '@/components/atoms/Text';
import { useThemeColors, palette } from '@/theme';
import { spacing, borderRadius, borderWidth } from '@/theme/spacing';

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  secureEntry?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
  secureEntry = false,
}) => {
  const colors = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Shake animation for error
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50, easing: Easing.linear }),
        withTiming(10, { duration: 50, easing: Easing.linear }),
        withTiming(-10, { duration: 50, easing: Easing.linear }),
        withTiming(10, { duration: 50, easing: Easing.linear }),
        withTiming(-5, { duration: 50, easing: Easing.linear }),
        withTiming(5, { duration: 50, easing: Easing.linear }),
        withTiming(0, { duration: 50, easing: Easing.linear })
      );
    }
  }, [error, shakeX]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handlePress = (): void => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string): void => {
    // Only allow digits
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= length) {
      onChange(cleanedText);
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  const renderDigits = (): JSX.Element[] => {
    const digits: JSX.Element[] = [];

    for (let i = 0; i < length; i++) {
      const isCurrentIndex = i === value.length;
      const isFilled = i < value.length;
      const showCursor = isFocused && isCurrentIndex;

      digits.push(
        <PinDigit
          key={i}
          digit={isFilled ? value[i] : ''}
          isFocused={showCursor}
          isFilled={isFilled}
          error={error}
          secureEntry={secureEntry}
          disabled={disabled}
        />
      );
    }

    return digits;
  };

  return (
    <Animated.View style={shakeAnimatedStyle}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="none"
        accessibilityLabel={`PIN input, ${value.length} of ${length} digits entered`}
      >
        <View style={styles.container}>
          {renderDigits()}
        </View>
      </Pressable>

      {/* Hidden TextInput for keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        editable={!disabled}
        style={styles.hiddenInput}
        caretHidden
        contextMenuHidden
        accessibilityLabel="PIN code input"
      />
    </Animated.View>
  );
};

// Individual digit box
interface PinDigitProps {
  digit: string;
  isFocused: boolean;
  isFilled: boolean;
  error: boolean;
  secureEntry: boolean;
  disabled: boolean;
}

const PinDigit: React.FC<PinDigitProps> = ({
  digit,
  isFocused,
  isFilled,
  error,
  secureEntry,
  disabled,
}) => {
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFilled) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
    }
  }, [isFilled, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBorderColor = (): string => {
    if (error) return colors.border.error;
    if (isFocused) return colors.border.focus;
    if (isFilled) return palette.primary[500];
    return colors.border.default;
  };

  const getBackgroundColor = (): string => {
    if (disabled) return colors.background.secondary;
    if (isFilled) return palette.primary[50];
    return colors.background.primary;
  };

  return (
    <Animated.View
      style={[
        styles.digitBox,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
        animatedStyle,
      ]}
    >
      {isFilled ? (
        secureEntry ? (
          <View style={styles.secureDot} />
        ) : (
          <Text variant="h2" style={styles.digitText}>
            {digit}
          </Text>
        )
      ) : isFocused ? (
        <Animated.View style={styles.cursor} />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  digitBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    color: palette.primary[700],
  },
  secureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.primary[500],
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: palette.primary[500],
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
});
