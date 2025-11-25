/**
 * Welcome Screen
 * Initial screen with hero animation, gradient background and CTAs
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms';
import { Text, Heading, Body } from '@/components/atoms/Text';
import { palette } from '@/theme/colors';
import { spacing, semanticSpacing, borderRadius } from '@/theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animated car icon component
const AnimatedCarIcon: React.FC = () => {
  const translateX = useSharedValue(-50);
  const bounce = useSharedValue(0);

  useEffect(() => {
    // Horizontal movement
    translateX.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(50, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-50, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Subtle bounce effect
    bounce.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [translateX, bounce]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: bounce.value },
    ],
  }));

  return (
    <Animated.View style={[styles.carIconContainer, animatedStyle]}>
      <View style={styles.carIcon}>
        <View style={styles.carBody} />
        <View style={styles.carTop} />
        <View style={styles.wheelLeft} />
        <View style={styles.wheelRight} />
      </View>
    </Animated.View>
  );
};

// Floating background shapes
const FloatingShape: React.FC<{
  size: number;
  delay: number;
  startX: number;
  startY: number;
}> = ({ size, delay, startX, startY }) => {
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.2, { duration: 2000 }),
          withTiming(0.1, { duration: 2000 })
        ),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [opacity, scale, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.floatingShape,
        {
          width: size,
          height: size,
          left: startX,
          top: startY,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function WelcomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Animation values
  const logoScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Content fade in
    contentOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 800 })
    );
  }, [logoScale, contentOpacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleGetStarted = (): void => {
    router.push('/(auth)/register');
  };

  const handleSignIn = (): void => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[palette.primary[500], palette.primary[700], palette.primary[900]]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating background shapes */}
        <FloatingShape size={200} delay={0} startX={-50} startY={100} />
        <FloatingShape size={150} delay={500} startX={SCREEN_WIDTH - 100} startY={200} />
        <FloatingShape size={100} delay={1000} startX={50} startY={SCREEN_HEIGHT - 300} />
        <FloatingShape size={120} delay={1500} startX={SCREEN_WIDTH - 150} startY={SCREEN_HEIGHT - 400} />

        {/* Content */}
        <View style={[styles.content, { paddingTop: insets.top + spacing['8'] }]}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            {/* Logo */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <View style={styles.logoCircle}>
                <AnimatedCarIcon />
              </View>
            </Animated.View>

            {/* Title and Subtitle */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.textContainer}
            >
              <Text
                variant="displayMedium"
                color="inverse"
                align="center"
                style={styles.title}
                accessibilityRole="header"
              >
                Carsharing SV
              </Text>
              <Text
                variant="bodyLarge"
                align="center"
                style={styles.subtitle}
                accessibilityLabel="Rent vehicles from local hosts or share yours with verified guests"
              >
                Rent vehicles from local hosts or share yours with verified guests
              </Text>
            </Animated.View>

            {/* Features */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.featuresContainer}
            >
              <FeatureBadge icon="✓" text="Verified hosts & guests" />
              <FeatureBadge icon="🔒" text="Secure payments" />
              <FeatureBadge icon="📍" text="Local rentals in El Salvador" />
            </Animated.View>
          </View>

          {/* CTA Section */}
          <Animated.View
            entering={FadeInDown.delay(800).duration(600)}
            style={[styles.ctaSection, { paddingBottom: insets.bottom + spacing['6'] }]}
          >
            <Button
              title="Get Started"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={handleGetStarted}
              accessibilityLabel="Get started with Carsharing SV"
              accessibilityHint="Navigate to account type selection"
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />

            <Button
              title="I already have an account"
              variant="ghost"
              size="lg"
              fullWidth
              onPress={handleSignIn}
              accessibilityLabel="Sign in to existing account"
              accessibilityHint="Navigate to login screen"
              style={styles.secondaryButton}
            />

            <Text
              variant="caption"
              align="center"
              style={styles.termsText}
              accessibilityLabel="By continuing, you agree to our Terms of Service and Privacy Policy"
            >
              By continuing, you agree to our{' '}
              <Text variant="caption" style={styles.linkText}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text variant="caption" style={styles.linkText}>
                Privacy Policy
              </Text>
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

// Feature badge component
const FeatureBadge: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View
    style={styles.featureBadge}
    accessibilityLabel={text}
    accessibilityRole="text"
  >
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text variant="labelSmall" style={styles.featureText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: semanticSpacing.screenPaddingX,
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['8'],
  },
  logoContainer: {
    marginBottom: spacing['8'],
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  carIconContainer: {
    width: 80,
    height: 40,
  },
  carIcon: {
    position: 'relative',
    width: 80,
    height: 40,
  },
  carBody: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    width: 80,
    height: 20,
    backgroundColor: palette.white,
    borderRadius: 4,
  },
  carTop: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    width: 50,
    height: 18,
    backgroundColor: palette.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  wheelLeft: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 16,
    height: 16,
    backgroundColor: palette.neutral[700],
    borderRadius: 8,
    borderWidth: 3,
    borderColor: palette.white,
  },
  wheelRight: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 16,
    height: 16,
    backgroundColor: palette.neutral[700],
    borderRadius: 8,
    borderWidth: 3,
    borderColor: palette.white,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
  },
  title: {
    color: palette.white,
    marginBottom: spacing['3'],
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing['2'],
    marginTop: spacing['8'],
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.full,
    gap: spacing['1.5'],
  },
  featureIcon: {
    fontSize: 14,
  },
  featureText: {
    color: palette.white,
  },
  ctaSection: {
    gap: spacing['3'],
  },
  primaryButton: {
    backgroundColor: palette.white,
  },
  primaryButtonText: {
    color: palette.primary[600],
  },
  secondaryButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing['2'],
  },
  linkText: {
    color: palette.white,
    textDecorationLine: 'underline',
  },
  floatingShape: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
