/**
 * Phone Verification Screen
 * OTP verification with timer and resend functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/atoms';
import { Text, Heading, Body } from '@/components/atoms/Text';
import { StepProgress } from '@/components/atoms/ProgressBar';
import { PinInput } from '@/components/molecules';
import { useThemeColors, palette } from '@/theme';
import { spacing, semanticSpacing, borderRadius } from '@/theme/spacing';

const RESEND_COOLDOWN = 60; // seconds
const CODE_LENGTH = 6;

export default function PhoneVerifyScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { phone, type } = useLocalSearchParams<{ phone: string; type: 'guest' | 'host' }>();

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Format phone for display
  const maskedPhone = phone
    ? `${phone.slice(0, -4).replace(/./g, '*')}${phone.slice(-4)}`
    : '****';

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      return undefined;
    }
  }, [resendTimer]);

  const handleCodeChange = (value: string): void => {
    setCode(value);
    setError(false);
  };

  const handleCodeComplete = useCallback(async (completeCode: string): Promise<void> => {
    if (isVerifying) return;

    setIsVerifying(true);
    setError(false);

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock: "123456" is the valid code
      if (completeCode === '123456') {
        // Success - navigate to next step (KYC or home)
        router.replace('/(tabs)');
      } else {
        setError(true);
        setCode('');
      }
    } catch (err) {
      setError(true);
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying]);

  const handleResendCode = async (): Promise<void> => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(RESEND_COOLDOWN);
    setError(false);
    setCode('');

    // Simulate API call to resend code
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleChangeNumber = (): void => {
    router.back();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stepLabels = ['Info', 'Verify', 'KYC', 'Done'];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerBackVisible: true,
          headerTintColor: colors.text.primary,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.content, { paddingTop: insets.top + spacing['16'] }]}>
          {/* Progress indicator */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.progressContainer}
          >
            <StepProgress
              steps={4}
              currentStep={1}
              labels={stepLabels}
            />
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.header}
          >
            <Heading level={1} style={styles.title}>
              Verify your phone
            </Heading>
            <Body size="md" color="secondary" style={styles.subtitle}>
              We sent a verification code to{' '}
              <Text variant="bodyMedium" style={styles.phoneText}>
                {phone || maskedPhone}
              </Text>
            </Body>
          </Animated.View>

          {/* PIN Input */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.pinContainer}
          >
            <PinInput
              length={CODE_LENGTH}
              value={code}
              onChange={handleCodeChange}
              onComplete={handleCodeComplete}
              error={error}
              disabled={isVerifying}
            />

            {/* Error message */}
            {error && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                style={styles.errorContainer}
              >
                <Text variant="bodySmall" color="error" align="center">
                  Invalid verification code. Please try again.
                </Text>
              </Animated.View>
            )}

            {/* Verifying indicator */}
            {isVerifying && (
              <View style={styles.verifyingContainer}>
                <Text variant="bodySmall" color="secondary" align="center">
                  Verifying...
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Resend section */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.resendContainer}
          >
            {canResend ? (
              <Pressable
                onPress={handleResendCode}
                accessibilityRole="button"
                accessibilityLabel="Resend verification code"
              >
                <Text variant="bodyMedium" color="link" align="center">
                  Resend code
                </Text>
              </Pressable>
            ) : (
              <Text variant="bodyMedium" color="tertiary" align="center">
                Resend code in{' '}
                <Text variant="bodyMedium" style={styles.timerText}>
                  {formatTime(resendTimer)}
                </Text>
              </Text>
            )}
          </Animated.View>

          {/* Change number link */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.changeNumberContainer}
          >
            <Pressable
              onPress={handleChangeNumber}
              accessibilityRole="button"
              accessibilityLabel="Change phone number"
            >
              <Text variant="bodySmall" color="secondary" align="center">
                Wrong number?{' '}
                <Text variant="bodySmall" color="link">
                  Change it
                </Text>
              </Text>
            </Pressable>
          </Animated.View>

          {/* Help text */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(400)}
            style={styles.helpContainer}
          >
            <View style={styles.helpCard}>
              <Text variant="labelMedium" style={styles.helpTitle}>
                Didn't receive the code?
              </Text>
              <Text variant="caption" color="secondary" style={styles.helpText}>
                • Check your SMS inbox and spam folder
              </Text>
              <Text variant="caption" color="secondary" style={styles.helpText}>
                • Make sure your phone number is correct
              </Text>
              <Text variant="caption" color="secondary" style={styles.helpText}>
                • Wait a few minutes and try resending
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + spacing['4'],
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <Text variant="caption" color="tertiary" align="center">
            By verifying, you confirm this phone number belongs to you
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: semanticSpacing.screenPaddingX,
  },
  progressContainer: {
    marginBottom: spacing['6'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['8'],
  },
  title: {
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneText: {
    fontWeight: '600',
    color: palette.primary[600],
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: spacing['6'],
  },
  errorContainer: {
    marginTop: spacing['4'],
  },
  verifyingContainer: {
    marginTop: spacing['4'],
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  timerText: {
    fontWeight: '600',
    color: palette.primary[600],
  },
  changeNumberContainer: {
    alignItems: 'center',
    marginBottom: spacing['8'],
  },
  helpContainer: {
    marginTop: 'auto',
  },
  helpCard: {
    backgroundColor: palette.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['4'],
  },
  helpTitle: {
    marginBottom: spacing['2'],
    color: palette.neutral[700],
  },
  helpText: {
    marginBottom: spacing['1'],
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: semanticSpacing.screenPaddingX,
    paddingTop: spacing['4'],
  },
});
