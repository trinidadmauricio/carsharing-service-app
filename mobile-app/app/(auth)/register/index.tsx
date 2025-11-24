/**
 * Account Type Selection Screen
 * Choose between Guest (renter) or Host (owner)
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  FadeInDown,
  FadeInUp,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms';
import { Text, Heading, Body } from '@/components/atoms/Text';
import { useThemeColors, palette } from '@/theme';
import { spacing, semanticSpacing, borderRadius, borderWidth } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

type AccountType = 'guest' | 'host' | null;

// Animated selection card component
const SelectionCard: React.FC<{
  type: 'guest' | 'host';
  icon: string;
  title: string;
  description: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}> = ({ type, icon, title, description, features, isSelected, onSelect, index }) => {
  const colors = useThemeColors();

  // Animation values
  const scale = useSharedValue(1);
  const borderColorProgress = useSharedValue(0);
  const backgroundColorProgress = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      borderColorProgress.value = withSpring(1, { damping: 15 });
      backgroundColorProgress.value = withSpring(1, { damping: 15 });
      checkmarkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      borderColorProgress.value = withSpring(0, { damping: 15 });
      backgroundColorProgress.value = withSpring(0, { damping: 15 });
      checkmarkScale.value = withSpring(0, { damping: 12 });
    }
  }, [isSelected, borderColorProgress, backgroundColorProgress, checkmarkScale]);

  const handlePressIn = (): void => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = (): void => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundColorProgress.value,
      [0, 1],
      [colors.background.primary, palette.primary[50]]
    );

    const borderColor = interpolateColor(
      borderColorProgress.value,
      [0, 1],
      [colors.border.default, palette.primary[500]]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      borderColor,
    };
  });

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 150).duration(500).springify()}
    >
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${title}: ${description}`}
        accessibilityHint={`Select to create a ${type} account`}
      >
        <Animated.View
          style={[
            styles.card,
            shadows.md,
            animatedContainerStyle,
          ]}
        >
          {/* Checkmark indicator */}
          <Animated.View style={[styles.checkmark, checkmarkAnimatedStyle]}>
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmarkIcon}>✓</Text>
            </View>
          </Animated.View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Heading level={3} style={[styles.cardTitle, { color: colors.text.primary }]}>
              {title}
            </Heading>
            <Body size="md" style={[styles.cardDescription, { color: colors.text.secondary }]}>
              {description}
            </Body>

            {/* Features list */}
            <View style={styles.featuresContainer}>
              {features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={[styles.featureDot, isSelected && styles.featureDotSelected]} />
                  <Text variant="bodySmall" style={{ color: colors.text.secondary }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function AccountTypeScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  // Button animation
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (selectedType) {
      buttonOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
      buttonTranslateY.value = withDelay(100, withSpring(0, { damping: 15 }));
    } else {
      buttonOpacity.value = withTiming(0, { duration: 200 });
      buttonTranslateY.value = withSpring(20, { damping: 15 });
    }
  }, [selectedType, buttonOpacity, buttonTranslateY]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handleSelectType = (type: AccountType): void => {
    setSelectedType(type);
  };

  const handleContinue = (): void => {
    if (!selectedType) return;

    router.push({
      pathname: '/(auth)/register/form',
      params: { type: selectedType },
    });
  };

  const handleBack = (): void => {
    router.back();
  };

  const accountTypes = [
    {
      type: 'guest' as const,
      icon: '🚗',
      title: 'I want to rent',
      description: 'Find and book vehicles from local hosts',
      features: [
        'Browse available vehicles nearby',
        'Book by hour, day, or week',
        'Secure payment protection',
        'Verified host profiles',
      ],
    },
    {
      type: 'host' as const,
      icon: '🔑',
      title: 'I want to share my car',
      description: 'List your vehicle and earn extra income',
      features: [
        'Set your own prices & availability',
        'Insurance coverage included',
        'Verified guest profiles',
        'Earn passive income',
      ],
    },
  ];

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: insets.top + spacing['16'],
              paddingBottom: insets.bottom + spacing['32'],
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.header}
          >
            <Heading level={1} style={styles.title}>
              Join Carsharing SV
            </Heading>
            <Body size="lg" color="secondary" style={styles.subtitle}>
              How do you want to use the app?
            </Body>
          </Animated.View>

          {/* Account type cards */}
          <View
            style={styles.cardsContainer}
            accessibilityRole="radiogroup"
            accessibilityLabel="Account type selection"
          >
            {accountTypes.map((account, index) => (
              <SelectionCard
                key={account.type}
                type={account.type}
                icon={account.icon}
                title={account.title}
                description={account.description}
                features={account.features}
                isSelected={selectedType === account.type}
                onSelect={() => handleSelectType(account.type)}
                index={index}
              />
            ))}
          </View>

          {/* Note */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(400)}
            style={styles.noteContainer}
          >
            <Text variant="caption" color="tertiary" align="center">
              You can always add the other option later from your profile settings.
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Continue button */}
        <Animated.View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + spacing['4'] },
            buttonAnimatedStyle,
          ]}
        >
          <Button
            title="Continue"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleContinue}
            disabled={!selectedType}
            accessibilityLabel={`Continue as ${selectedType || 'guest or host'}`}
            accessibilityHint="Proceed to registration form"
          />
        </Animated.View>
      </View>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: semanticSpacing.screenPaddingX,
  },
  header: {
    marginBottom: spacing['6'],
  },
  title: {
    marginBottom: spacing['2'],
  },
  subtitle: {
    lineHeight: 24,
  },
  cardsContainer: {
    gap: spacing['4'],
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: borderWidth.medium,
    padding: spacing['5'],
    position: 'relative',
  },
  checkmark: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    zIndex: 1,
  },
  checkmarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  icon: {
    fontSize: 32,
  },
  cardContent: {},
  cardTitle: {
    marginBottom: spacing['1'],
  },
  cardDescription: {
    marginBottom: spacing['4'],
    lineHeight: 22,
  },
  featuresContainer: {
    gap: spacing['2'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.neutral[300],
  },
  featureDotSelected: {
    backgroundColor: palette.primary[500],
  },
  noteContainer: {
    marginTop: spacing['6'],
    paddingHorizontal: spacing['4'],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: semanticSpacing.screenPaddingX,
    paddingTop: spacing['4'],
    backgroundColor: palette.white,
  },
});
