/**
 * Host Onboarding - Benefits Page
 * Shows benefits of becoming a host
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';
import type { HostBenefit } from '@/types/host';

// Host benefits data
const BENEFITS: HostBenefit[] = [
  {
    id: 'earnings',
    title: 'Earn Extra Income',
    description: 'Make $500-$2,000+ per month by sharing your car when not in use',
    icon: 'cash-outline',
    highlight: true,
  },
  {
    id: 'protection',
    title: '$750K Protection',
    description: 'Comprehensive insurance coverage for every trip, protecting you and your vehicle',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'control',
    title: 'You are in Control',
    description: 'Set your own price, availability, and choose who can rent your car',
    icon: 'settings-outline',
  },
  {
    id: 'instant',
    title: 'Instant Book Option',
    description: 'Enable instant booking to maximize earnings with automatic approvals',
    icon: 'flash-outline',
  },
  {
    id: 'support',
    title: '24/7 Support',
    description: 'Our dedicated team is here to help whenever you need assistance',
    icon: 'headset-outline',
  },
  {
    id: 'easy',
    title: 'Easy to Get Started',
    description: 'List your car in minutes and start earning quickly',
    icon: 'rocket-outline',
  },
];

export default function HostOnboardingBenefitsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const handleGetStarted = (): void => {
    router.push('/(host)/onboarding/requirements' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Become a Host',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: spacing['4'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: palette.primary[100] }]}>
            <Ionicons name="car-sport" size={48} color={palette.primary[600]} />
          </View>
          <Text variant="h1" style={{ color: colors.text.primary, textAlign: 'center', marginTop: spacing['4'] }}>
            Turn Your Car Into Cash
          </Text>
          <Text
            variant="body1"
            style={{
              color: colors.text.secondary,
              textAlign: 'center',
              marginTop: spacing['2'],
              marginHorizontal: spacing['6'],
            }}
          >
            Join thousands of hosts earning extra income by sharing their vehicles
          </Text>
        </View>

        {/* Earnings Highlight */}
        <Card style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Ionicons name="trending-up" size={24} color={palette.success[700]} />
            <Text
              variant="h3"
              style={{ color: palette.success[900], marginLeft: spacing['2'] }}
            >
              Average Earnings
            </Text>
          </View>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsStat}>
              <Text variant="h2" style={{ color: palette.success[700] }}>
                $1,200
              </Text>
              <Text variant="caption" style={{ color: palette.success[800], marginTop: spacing['1'] }}>
                per month
              </Text>
            </View>
            <View style={styles.earningsStat}>
              <Text variant="h2" style={{ color: palette.success[700] }}>
                70%
              </Text>
              <Text variant="caption" style={{ color: palette.success[800], marginTop: spacing['1'] }}>
                keep of earnings
              </Text>
            </View>
          </View>
          <Text
            variant="caption"
            style={{
              color: palette.success[800],
              marginTop: spacing['3'],
              textAlign: 'center',
            }}
          >
            *Based on average host with Standard protection plan
          </Text>
        </Card>

        {/* Benefits Grid */}
        <View style={styles.benefitsSection}>
          <Text variant="h2" style={{ color: colors.text.primary, marginBottom: spacing['4'] }}>
            Why Host With Us?
          </Text>

          {BENEFITS.map((benefit) => (
            <Card
              key={benefit.id}
              style={benefit.highlight ? styles.benefitCardHighlight : styles.benefitCard}
            >
              <View style={styles.benefitHeader}>
                <View
                  style={[
                    styles.benefitIcon,
                    {
                      backgroundColor: benefit.highlight
                        ? palette.primary[100]
                        : palette.neutral[100],
                    },
                  ]}
                >
                  <Ionicons
                    name={benefit.icon as any}
                    size={24}
                    color={benefit.highlight ? palette.primary[600] : palette.neutral[600]}
                  />
                </View>
                <View style={styles.benefitContent}>
                  <Text variant="h4" style={{ color: colors.text.primary }}>
                    {benefit.title}
                  </Text>
                  <Text
                    variant="body2"
                    style={{ color: colors.text.secondary, marginTop: spacing['1'] }}
                  >
                    {benefit.description}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* How It Works */}
        <View style={styles.stepsSection}>
          <Text variant="h2" style={{ color: colors.text.primary, marginBottom: spacing['4'] }}>
            How It Works
          </Text>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[500] }]}>
              <Text variant="body1" style={{ color: '#FFF', fontWeight: '600' }}>
                1
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                List Your Vehicle
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                Add photos, set your price, and describe your car
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[500] }]}>
              <Text variant="body1" style={{ color: '#FFF', fontWeight: '600' }}>
                2
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                Get Booked
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                Approve trip requests or enable instant booking
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[500] }]}>
              <Text variant="body1" style={{ color: '#FFF', fontWeight: '600' }}>
                3
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                Get Paid
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                Receive direct deposits after each successful trip
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.default,
            paddingBottom: insets.bottom + spacing['4'],
          },
        ]}
      >
        <Button
          variant="primary"
          size="lg"
          onPress={handleGetStarted}
          style={styles.ctaButton}
        >
          Get Started
        </Button>
        <Text
          variant="caption"
          style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: spacing['2'] }}
        >
          Takes about 10 minutes to complete
        </Text>
      </View>
    </View>
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
    paddingBottom: spacing['6'],
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['6'],
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    marginBottom: spacing['6'],
    backgroundColor: palette.success[50],
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsStat: {
    alignItems: 'center',
  },
  benefitsSection: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['6'],
  },
  benefitCard: {
    marginBottom: spacing['3'],
    padding: spacing['4'],
  },
  benefitCardHighlight: {
    marginBottom: spacing['3'],
    padding: spacing['4'],
    borderWidth: 2,
    borderColor: palette.primary[500],
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  stepsSection: {
    paddingHorizontal: spacing['4'],
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: spacing['4'],
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  bottomCTA: {
    borderTopWidth: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  ctaButton: {
    width: '100%',
  },
});
