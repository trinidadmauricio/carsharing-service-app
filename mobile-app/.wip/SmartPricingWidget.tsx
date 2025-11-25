/**
 * SmartPricingWidget Component
 * Displays smart pricing recommendation with market insights
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '../atoms';
import { palette, spacing } from '@/theme';
import type { SmartPriceResult } from '../../types/pricing';

interface SmartPricingWidgetProps {
  result: SmartPriceResult | undefined;
  isLoading?: boolean;
  error?: Error | null;
  onAcceptPrice?: (price: number) => void;
}

export function SmartPricingWidget({
  result,
  isLoading,
  error,
}: SmartPricingWidgetProps): React.JSX.Element {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary[500]} />
          <Text variant="body" style={styles.loadingText}>
            Calculating smart price...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="body" style={styles.errorText}>
            Unable to calculate smart price. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  const confidenceColor =
    result.confidenceLevel === 'high'
      ? palette.success[500]
      : result.confidenceLevel === 'medium'
        ? palette.warning[500]
        : palette.neutral[400];

  const competitiveColor =
    result.marketInsights.competitivePosition === 'below'
      ? palette.success[500]
      : result.marketInsights.competitivePosition === 'average'
        ? palette.info[500]
        : palette.warning[500];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>
          Smart Pricing Recommendation
        </Text>
        <View style={styles.confidenceBadge}>
          <View style={[styles.confidenceDot, { backgroundColor: confidenceColor }]} />
          <Text variant="caption" style={styles.confidenceText}>
            {result.confidenceLevel} confidence ({result.confidenceScore}%)
          </Text>
        </View>
      </View>

      {/* Recommended Price */}
      <View style={styles.priceSection}>
        <Text variant="caption" color="neutral" style={styles.priceLabel}>
          Recommended Daily Rate
        </Text>
        <Text variant="h1" style={styles.recommendedPrice}>
          ${result.recommendedDailyRate}
        </Text>
        <Text variant="body" color="neutral" style={styles.priceRange}>
          Range: ${result.minRecommended} - ${result.maxRecommended}
        </Text>
      </View>

      {/* Market Insights */}
      <View style={styles.insightsSection}>
        <Text variant="body-bold" style={styles.sectionTitle}>
          Market Insights
        </Text>

        <View style={styles.insightRow}>
          <Text variant="body" color="neutral">
            Competitive Position:
          </Text>
          <View style={styles.insightValueContainer}>
            <View style={[styles.positionDot, { backgroundColor: competitiveColor }]} />
            <Text variant="body-bold" style={[styles.insightValue, { color: competitiveColor }]}>
              {result.marketInsights.competitivePosition.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.insightRow}>
          <Text variant="body" color="neutral">
            Est. Booking Rate:
          </Text>
          <Text variant="body-bold" style={styles.insightValue}>
            {result.marketInsights.estimatedBookingRate}%
          </Text>
        </View>
      </View>

      {/* Earnings Estimate */}
      <View style={styles.earningsSection}>
        <Text variant="body-bold" style={styles.sectionTitle}>
          Estimated Earnings
        </Text>

        <View style={styles.earningsGrid}>
          <View style={styles.earningsItem}>
            <Text variant="caption" color="neutral">
              Daily
            </Text>
            <Text variant="h4">${result.earningsEstimate.daily}</Text>
          </View>

          <View style={styles.earningsItem}>
            <Text variant="caption" color="neutral">
              Weekly
            </Text>
            <Text variant="h4">${result.earningsEstimate.weekly}</Text>
          </View>

          <View style={styles.earningsItem}>
            <Text variant="caption" color="neutral">
              Monthly
            </Text>
            <Text variant="h4">${result.earningsEstimate.monthly}</Text>
          </View>
        </View>

        <Text variant="caption" color="neutral" style={styles.earningsNote}>
          After {result.earningsEstimate.platformFee}% platform fee • Assumes 50% utilization
        </Text>
      </View>

      {/* Suggested Discounts */}
      <View style={styles.discountsSection}>
        <Text variant="body-bold" style={styles.sectionTitle}>
          Suggested Discounts
        </Text>

        <View style={styles.discountRow}>
          <Text variant="body" color="neutral">
            Weekly (7+ days):
          </Text>
          <Text variant="body-bold" style={styles.discountValue}>
            {result.marketInsights.suggestedWeeklyDiscount}% off
          </Text>
        </View>

        <View style={styles.discountRow}>
          <Text variant="body" color="neutral">
            Monthly (28+ days):
          </Text>
          <Text variant="body-bold" style={styles.discountValue}>
            {result.marketInsights.suggestedMonthlyDiscount}% off
          </Text>
        </View>
      </View>

      {/* Info Note */}
      <View style={styles.infoBox}>
        <Text variant="caption" color="neutral" style={styles.infoText}>
          This recommendation is based on your vehicle type, location, features, and current market
          conditions. You can adjust the price to match your preferences.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.neutral[0],
    borderRadius: 16,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing['8'],
  },
  loadingText: {
    marginTop: spacing['3'],
    color: palette.neutral[600],
  },
  errorContainer: {
    padding: spacing['4'],
    backgroundColor: palette.error[50],
    borderRadius: 8,
  },
  errorText: {
    color: palette.error[700],
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing['5'],
  },
  title: {
    marginBottom: spacing['2'],
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing['2'],
  },
  confidenceText: {
    color: palette.neutral[600],
    textTransform: 'capitalize',
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: spacing['5'],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[200],
  },
  priceLabel: {
    marginBottom: spacing['1'],
  },
  recommendedPrice: {
    color: palette.primary[500],
    marginVertical: spacing['1'],
  },
  priceRange: {
    marginTop: spacing['1'],
  },
  insightsSection: {
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[200],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  insightValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing['2'],
  },
  insightValue: {
    color: palette.neutral[900],
  },
  earningsSection: {
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[200],
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['3'],
  },
  earningsItem: {
    alignItems: 'center',
    flex: 1,
  },
  earningsNote: {
    textAlign: 'center',
  },
  discountsSection: {
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[200],
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing['2'],
  },
  discountValue: {
    color: palette.success[600],
  },
  infoBox: {
    marginTop: spacing['4'],
    padding: spacing['3'],
    backgroundColor: palette.info[50],
    borderRadius: 8,
  },
  infoText: {
    color: palette.info[700],
    lineHeight: 20,
  },
});
