/**
 * Login Screen
 * Email/password login with biometrics support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router, Stack, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Input, Card } from '@/components/atoms';
import { Text, Heading, Body } from '@/components/atoms/Text';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette } from '@/theme';
import { spacing, semanticSpacing, borderRadius } from '@/theme/spacing';
import { useAuth, useBiometrics, getBiometricDisplayName, useSecureStorage, STORAGE_KEYS } from '@/hooks';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { login, loginWithBiometrics, isLoading: authLoading } = useAuth();
  const { isAvailable, biometricType, isEnrolled, isLoading: biometricsLoading } = useBiometrics();
  const { getItem } = useSecureStorage();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if biometrics is enabled and load remembered email
  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      const [biometricsSetting, rememberedEmail] = await Promise.all([
        getItem(STORAGE_KEYS.BIOMETRICS_ENABLED),
        getItem(STORAGE_KEYS.REMEMBER_EMAIL),
      ]);

      setBiometricsEnabled(biometricsSetting === 'true');

      if (rememberedEmail) {
        setValue('email', rememberedEmail);
      }
    };

    loadSettings();
  }, [getItem, setValue]);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setLoginError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = async (): Promise<void> => {
    setLoginError(null);

    const result = await loginWithBiometrics();

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setLoginError(result.error || 'Biometric authentication failed');
    }
  };

  const showBiometricButton = isAvailable && isEnrolled && biometricsEnabled && !biometricsLoading;

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

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background.primary }]}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing['16'] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.header}
          >
            <Heading level={1} style={styles.title}>
              Welcome back
            </Heading>
            <Body size="md" color="secondary">
              Sign in to continue to Carsharing SV
            </Body>
          </Animated.View>

          {/* Biometric login button */}
          {showBiometricButton && (
            <Animated.View
              entering={FadeInDown.delay(200).duration(400)}
              style={styles.biometricContainer}
            >
              <Pressable
                onPress={handleBiometricLogin}
                style={styles.biometricButton}
                accessibilityRole="button"
                accessibilityLabel={`Sign in with ${getBiometricDisplayName(biometricType)}`}
              >
                <View style={styles.biometricIcon}>
                  <Text style={styles.biometricEmoji}>
                    {biometricType === 'facial' ? '🔐' : '👆'}
                  </Text>
                </View>
                <Text variant="labelLarge" style={styles.biometricText}>
                  Sign in with {getBiometricDisplayName(biometricType)}
                </Text>
              </Pressable>

              <Divider label="or" style={styles.divider} />
            </Animated.View>
          )}

          {/* Login form */}
          <Animated.View
            entering={FadeInDown.delay(showBiometricButton ? 300 : 200).duration(400)}
            style={styles.form}
          >
            {/* Error message */}
            {loginError && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                style={styles.errorContainer}
              >
                <Card variant="filled" style={styles.errorCard}>
                  <Text variant="bodySmall" color="error">
                    {loginError}
                  </Text>
                </Card>
              </Animated.View>
            )}

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setLoginError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  required
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setLoginError(null);
                  }}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  required
                  rightIcon={
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Text variant="labelSmall" color="link">
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  }
                />
              )}
            />

            {/* Forgot password link */}
            <View style={styles.forgotPasswordContainer}>
              <Link href="/(auth)/forgot-password" asChild>
                <Pressable accessibilityRole="link">
                  <Text variant="bodySmall" color="link">
                    Forgot your password?
                  </Text>
                </Pressable>
              </Link>
            </View>

            {/* Submit button */}
            <Button
              title="Sign In"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting || authLoading}
              disabled={!isValid || isSubmitting || authLoading}
              accessibilityLabel="Sign in to your account"
            />
          </Animated.View>

          {/* Social login section */}
          <Animated.View
            entering={FadeInDown.delay(showBiometricButton ? 400 : 300).duration(400)}
            style={styles.socialContainer}
          >
            <Divider label="or continue with" style={styles.divider} />

            <View style={styles.socialButtons}>
              <Pressable
                style={[styles.socialButton, { borderColor: colors.border.default }]}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Google"
              >
                <Text style={styles.socialIcon}>G</Text>
                <Text variant="labelMedium">Google</Text>
              </Pressable>

              <Pressable
                style={[styles.socialButton, { borderColor: colors.border.default }]}
                accessibilityRole="button"
                accessibilityLabel="Sign in with Apple"
              >
                <Text style={styles.socialIcon}></Text>
                <Text variant="labelMedium">Apple</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Sign up link */}
          <Animated.View
            entering={FadeInDown.delay(showBiometricButton ? 500 : 400).duration(400)}
            style={styles.signUpContainer}
          >
            <Text variant="bodyMedium" color="secondary">
              Don't have an account?{' '}
              <Link href="/(auth)/register" asChild>
                <Text variant="bodyMedium" color="link" style={styles.signUpLink}>
                  Sign up
                </Text>
              </Link>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: semanticSpacing.screenPaddingX,
    paddingBottom: spacing['8'],
  },
  header: {
    marginBottom: spacing['8'],
  },
  title: {
    marginBottom: spacing['2'],
  },
  biometricContainer: {
    marginBottom: spacing['4'],
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.neutral[50],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['6'],
    gap: spacing['3'],
  },
  biometricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricEmoji: {
    fontSize: 20,
  },
  biometricText: {
    color: palette.primary[700],
  },
  divider: {
    marginVertical: spacing['6'],
  },
  form: {
    gap: semanticSpacing.formFieldGap,
  },
  errorContainer: {
    marginBottom: spacing['2'],
  },
  errorCard: {
    backgroundColor: palette.error[50],
    padding: spacing['3'],
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -spacing['2'],
    marginBottom: spacing['2'],
  },
  socialContainer: {
    marginTop: spacing['6'],
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3'],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing['2'],
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: spacing['8'],
  },
  signUpLink: {
    fontWeight: '600',
  },
});
