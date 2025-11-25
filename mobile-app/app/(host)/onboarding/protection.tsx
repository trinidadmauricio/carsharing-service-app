/**
 * Host Onboarding - Protection Plan Selection
 * Choose a protection plan and view earnings projections
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';
import { HOST_PROTECTION_PLANS } from '@/types/protection';
import type { ProtectionPlan } from '@/types/protection';

interface EarningsCalculation {
  dailyRate: number;
  platformFee: number;
  hostEarnings: number;
  monthlyTrips: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
}

export default function HostOnboardingProtectionScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('host_standard');
  const [dailyRate, setDailyRate] = useState<number>(50);

  const selectedPlan = HOST_PROTECTION_PLANS.find((p) => p.id === selectedPlanId);

  // Calculate earnings
  const calculateEarnings = (): EarningsCalculation => {
    if (!selectedPlan || !selectedPlan.earningsPercentage) {
      return {
        dailyRate: 0,
        platformFee: 0,
        hostEarnings: 0,
        monthlyTrips: 0,
        monthlyEarnings: 0,
        yearlyEarnings: 0,
      };
    }

    const hostEarningsPerDay = dailyRate * (selectedPlan.earningsPercentage / 100);
    const platformFeePercentage = 100 - selectedPlan.earningsPercentage;
    const platformFeePerDay = dailyRate * (platformFeePercentage / 100);

    // Assumptions: 40% utilization, 3-day average trip
    const utilizationRate = 0.4;
    const averageTripLength = 3;
    const daysPerMonth = 30;

    const rentedDaysPerMonth = daysPerMonth * utilizationRate;
    const tripsPerMonth = rentedDaysPerMonth / averageTripLength;
    const monthlyEarnings = hostEarningsPerDay * rentedDaysPerMonth;
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      dailyRate,
      platformFee: platformFeePerDay,
      hostEarnings: hostEarningsPerDay,
      monthlyTrips: Math.round(tripsPerMonth),
      monthlyEarnings: Math.round(monthlyEarnings),
      yearlyEarnings: Math.round(yearlyEarnings),
    };
  };

  const earnings = calculateEarnings();

  const handleContinue = (): void => {
    // TODO: Save selected protection plan
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Choose Protection',
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
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" style={{ color: colors.text.primary }}>
            Select Your Protection Plan
          </Text>
          <Text
            variant="body2"
            style={{ color: colors.text.secondary, marginTop: spacing['2'] }}
          >
            Choose the plan that best fits your needs. Higher protection plans earn more per trip.
          </Text>
        </View>

        {/* Protection Plans */}
        <View style={styles.plansList}>
          {HOST_PROTECTION_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.7}
              >
                <Card
                  style={
                    isSelected
                      ? styles.planCardSelected
                      : plan.recommended
                      ? styles.planCardRecommended
                      : styles.planCard
                  }
                >
                  {/* Plan Header */}
                  <View style={styles.planHeader}>
                    <View style={styles.planTitleRow}>
                      <Text
                        variant="h3"
                        style={{ color: colors.text.primary, flex: 1 }}
                      >
                        {plan.name}
                      </Text>
                      {plan.recommended && (
                        <View
                          style={[
                            styles.recommendedBadge,
                            { backgroundColor: palette.success[100] },
                          ]}
                        >
                          <Text
                            variant="caption"
                            style={{
                              color: palette.success[700],
                              fontWeight: '600',
                            }}
                          >
                            Recommended
                          </Text>
                        </View>
                      )}
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={palette.primary[600]}
                        />
                      )}
                    </View>
                    <Text
                      variant="body2"
                      style={{
                        color: colors.text.secondary,
                        marginTop: spacing['1'],
                      }}
                    >
                      {plan.description}
                    </Text>
                  </View>

                  {/* Earnings Highlight */}
                  <View
                    style={[
                      styles.earningsBox,
                      { backgroundColor: palette.success[50] },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{ color: palette.success[800] }}
                    >
                      You keep
                    </Text>
                    <Text
                      variant="h2"
                      style={{
                        color: palette.success[700],
                        marginTop: spacing['1'],
                      }}
                    >
                      {plan.earningsPercentage}%
                    </Text>
                    <Text
                      variant="caption"
                      style={{
                        color: palette.success[800],
                        marginTop: spacing['1'],
                      }}
                    >
                      of each trip
                    </Text>
                  </View>

                  <Divider style={{ marginVertical: spacing['3'] }} />

                  {/* Coverage Details */}
                  <View style={styles.coverageDetails}>
                    <View style={styles.coverageRow}>
                      <Text variant="caption" style={{ color: colors.text.secondary }}>
                        Liability Coverage
                      </Text>
                      <Text
                        variant="body2"
                        style={{ color: colors.text.primary, fontWeight: '600' }}
                      >
                        ${(plan.liabilityCoverage / 1000).toFixed(0)}k
                      </Text>
                    </View>
                    <View style={styles.coverageRow}>
                      <Text variant="caption" style={{ color: colors.text.secondary }}>
                        Your Deductible
                      </Text>
                      <Text
                        variant="body2"
                        style={{ color: colors.text.primary, fontWeight: '600' }}
                      >
                        ${plan.deductible.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Included Features */}
                  <View style={styles.featuresSection}>
                    <Text
                      variant="caption"
                      style={{
                        color: colors.text.secondary,
                        fontWeight: '600',
                        marginBottom: spacing['2'],
                      }}
                    >
                      Included Coverage
                    </Text>
                    {plan.features.map((feature: string, idx: number) => (
                      <View key={idx} style={styles.featureRow}>
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={palette.success[600]}
                        />
                        <Text
                          variant="caption"
                          style={{
                            color: colors.text.primary,
                            marginLeft: spacing['2'],
                          }}
                        >
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Earnings Calculator */}
        <Card style={styles.calculatorCard}>
          <Text variant="h3" style={{ color: colors.text.primary }}>
            Your Earnings Estimate
          </Text>
          <Text
            variant="caption"
            style={{
              color: colors.text.secondary,
              marginTop: spacing['1'],
            }}
          >
            Based on {selectedPlan?.name} plan at ${dailyRate}/day
          </Text>

          <Divider style={{ marginVertical: spacing['3'] }} />

          {/* Breakdown */}
          <View style={styles.breakdownRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Daily rate
            </Text>
            <Text
              variant="body1"
              style={{ color: colors.text.primary, fontWeight: '600' }}
            >
              ${earnings.dailyRate.toFixed(2)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Platform fee ({selectedPlan?.earningsPercentage ? 100 - selectedPlan.earningsPercentage : 0}%)
            </Text>
            <Text variant="body1" style={{ color: palette.error[600] }}>
              -${earnings.platformFee.toFixed(2)}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text
              variant="body1"
              style={{ color: colors.text.primary, fontWeight: '600' }}
            >
              You earn per day
            </Text>
            <Text
              variant="body1"
              style={{ color: palette.success[600], fontWeight: '600' }}
            >
              ${earnings.hostEarnings.toFixed(2)}
            </Text>
          </View>

          <Divider style={{ marginVertical: spacing['3'] }} />

          {/* Projections */}
          <View style={styles.projectionsGrid}>
            <View style={styles.projectionItem}>
              <Text
                variant="h2"
                style={{ color: palette.success[700] }}
              >
                ${earnings.monthlyEarnings.toLocaleString()}
              </Text>
              <Text
                variant="caption"
                style={{
                  color: colors.text.secondary,
                  marginTop: spacing['1'],
                }}
              >
                Est. monthly earnings
              </Text>
            </View>
            <View style={styles.projectionItem}>
              <Text
                variant="h2"
                style={{ color: palette.success[700] }}
              >
                {earnings.monthlyTrips}
              </Text>
              <Text
                variant="caption"
                style={{
                  color: colors.text.secondary,
                  marginTop: spacing['1'],
                }}
              >
                Est. trips per month
              </Text>
            </View>
          </View>

          <Text
            variant="caption"
            style={{
              color: colors.text.tertiary,
              marginTop: spacing['3'],
              textAlign: 'center',
            }}
          >
            *Based on 40% utilization rate and 3-day average trip length. Actual earnings may vary.
          </Text>
        </Card>

        {/* Important Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={palette.info[600]} />
            <Text
              variant="body2"
              style={{
                color: palette.info[900],
                fontWeight: '600',
                marginLeft: spacing['2'],
              }}
            >
              Important to Know
            </Text>
          </View>
          <Text
            variant="caption"
            style={{
              color: palette.info[800],
              marginTop: spacing['2'],
              lineHeight: 18,
            }}
          >
            • You can change your protection plan at any time{'\n'}
            • Coverage is active during every trip{'\n'}
            • Your personal insurance is not affected{'\n'}
            • Deductible only applies if you are at fault{'\n'}
            • All claims are handled by our insurance partner
          </Text>
        </Card>
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
          onPress={handleContinue}
          style={styles.ctaButton}
        >
          Complete Setup
        </Button>
        <Text
          variant="caption"
          style={{
            color: colors.text.tertiary,
            textAlign: 'center',
            marginTop: spacing['2'],
          }}
        >
          Selected: {selectedPlan?.name} Plan
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
  header: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
  },
  plansList: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
    gap: spacing['3'],
  },
  planCard: {
    padding: spacing['4'],
    marginBottom: spacing['3'],
  },
  planCardSelected: {
    padding: spacing['4'],
    marginBottom: spacing['3'],
    borderWidth: 2,
    borderColor: palette.primary[500],
  },
  planCardRecommended: {
    padding: spacing['4'],
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: palette.success[300],
  },
  planHeader: {
    marginBottom: spacing['3'],
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  recommendedBadge: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: 4,
  },
  earningsBox: {
    padding: spacing['3'],
    borderRadius: 8,
    alignItems: 'center',
  },
  coverageDetails: {
    gap: spacing['2'],
  },
  coverageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuresSection: {
    marginTop: spacing['3'],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing['1'],
  },
  calculatorCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    marginBottom: spacing['4'],
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  projectionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  projectionItem: {
    alignItems: 'center',
  },
  infoCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.info[50],
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
