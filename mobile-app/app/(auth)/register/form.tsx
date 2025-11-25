/**
 * Registration Form Screen
 * Basic information form with validation
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Input } from '@/components/atoms';
import { Text, Heading, Body } from '@/components/atoms/Text';
import { StepProgress } from '@/components/atoms/ProgressBar';
import { useThemeColors, palette } from '@/theme';
import { spacing, semanticSpacing, borderRadius } from '@/theme/spacing';

// Validation schema
const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Last name can only contain letters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\-\s]+$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

// Password requirements component
const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ];

  return (
    <View style={styles.requirementsContainer}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.requirementItem}>
          <View
            style={[
              styles.requirementDot,
              req.met && styles.requirementDotMet,
            ]}
          />
          <Text
            variant="caption"
            color={req.met ? 'success' : 'tertiary'}
          >
            {req.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default function RegistrationFormScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { type } = useLocalSearchParams<{ type: 'guest' | 'host' }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: RegistrationFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to phone verification
      router.push({
        pathname: '/(auth)/register/phone-verify',
        params: {
          phone: data.phone,
          type: type || 'guest',
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              Create your account
            </Heading>
            <Body size="md" color="secondary">
              {type === 'host'
                ? 'Start sharing your vehicle and earning'
                : 'Start renting vehicles from local hosts'}
            </Body>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.form}
          >
            {/* Name row */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      autoCapitalize="words"
                      autoComplete="given-name"
                      textContentType="givenName"
                      required
                    />
                  )}
                />
              </View>

              <View style={styles.nameField}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      autoCapitalize="words"
                      autoComplete="family-name"
                      textContentType="familyName"
                      required
                    />
                  )}
                />
              </View>
            </View>

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="john@example.com"
                  value={value}
                  onChangeText={onChange}
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

            {/* Phone */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone number"
                  placeholder="+503 7000 0000"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
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
                  placeholder="Create a strong password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
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

            {/* Password requirements */}
            {watchPassword.length > 0 && (
              <PasswordRequirements password={watchPassword} />
            )}

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm password"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  required
                  rightIcon={
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <Text variant="labelSmall" color="link">
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  }
                />
              )}
            />
          </Animated.View>

          {/* Terms notice */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={styles.termsContainer}
          >
            <Text variant="caption" color="tertiary" align="center">
              By creating an account, you agree to our{' '}
              <Text variant="caption" color="link">
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text variant="caption" color="link">
                Privacy Policy
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Submit button */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + spacing['4'],
              backgroundColor: colors.background.primary,
            },
          ]}
        >
          <Button
            title="Continue"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            accessibilityLabel="Continue to phone verification"
            accessibilityHint="Submits your registration information"
          />
        </Animated.View>
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
    paddingBottom: spacing['24'],
  },
  progressContainer: {
    marginBottom: spacing['6'],
  },
  header: {
    marginBottom: spacing['6'],
  },
  title: {
    marginBottom: spacing['2'],
  },
  form: {
    gap: semanticSpacing.formFieldGap,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  nameField: {
    flex: 1,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
    marginTop: -spacing['2'],
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.neutral[300],
  },
  requirementDotMet: {
    backgroundColor: palette.success[500],
  },
  termsContainer: {
    marginTop: spacing['6'],
    paddingHorizontal: spacing['4'],
  },
  footer: {
    paddingHorizontal: semanticSpacing.screenPaddingX,
    paddingTop: spacing['4'],
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
  },
});
