/**
 * Vehicle Pricing Screen
 * Smart pricing with manual adjustments and discount configuration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input } from '../../../components/atoms';
import { SmartPricingWidget } from '../../../components/molecules';
import { useSmartPrice } from '../../../hooks/useSmartPricing';
import { palette, spacing } from '@/theme';
import type { PricingFactors, VehicleType } from '../../../types';

export default function VehiclePricingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    vehicleType?: VehicleType;
    year?: string;
    make?: string;
    model?: string;
    city?: string;
    state?: string;
    features?: string;
  }>();

  // Pricing state
  const [dailyRate, setDailyRate] = useState<string>('');
  const [weeklyDiscount, setWeeklyDiscount] = useState<string>('10');
  const [monthlyDiscount, setMonthlyDiscount] = useState<string>('20');
  const [useSmartPricing, setUseSmartPricing] = useState<boolean>(true);

  // Build pricing factors from params
  const pricingFactors: PricingFactors | null = React.useMemo(() => {
    if (
      !params.vehicleType ||
      !params.year ||
      !params.make ||
      !params.model ||
      !params.city ||
      !params.state
    ) {
      return null;
    }

    const features = params.features ? params.features.split(',') : [];

    return {
      vehicleType: params.vehicleType,
      year: parseInt(params.year, 10),
      make: params.make,
      model: params.model,
      location: {
        city: params.city,
        state: params.state,
        latitude: 13.6929, // San Salvador default
        longitude: -89.2182,
      },
      features,
      instantBookEnabled: false, // Will be set in next step
    };
  }, [params]);

  // Fetch smart pricing
  const { data: smartPrice, isLoading, error } = useSmartPrice(pricingFactors);

  // Auto-fill with smart price when available
  useEffect(() => {
    if (smartPrice && useSmartPricing && !dailyRate) {
      setDailyRate(smartPrice.recommendedDailyRate.toString());
      setWeeklyDiscount(smartPrice.marketInsights.suggestedWeeklyDiscount.toString());
      setMonthlyDiscount(smartPrice.marketInsights.suggestedMonthlyDiscount.toString());
    }
  }, [smartPrice, useSmartPricing, dailyRate]);

  const handleApplySmartPrice = (): void => {
    if (!smartPrice) return;

    setDailyRate(smartPrice.recommendedDailyRate.toString());
    setWeeklyDiscount(smartPrice.marketInsights.suggestedWeeklyDiscount.toString());
    setMonthlyDiscount(smartPrice.marketInsights.suggestedMonthlyDiscount.toString());
    setUseSmartPricing(true);
  };

  const handleContinue = (): void => {
    const rate = parseFloat(dailyRate);
    const weekly = parseFloat(weeklyDiscount);
    const monthly = parseFloat(monthlyDiscount);

    // Validation
    if (!dailyRate || isNaN(rate) || rate < 10) {
      Alert.alert('Invalid Price', 'Daily rate must be at least $10');
      return;
    }

    if (weekly < 0 || weekly > 50) {
      Alert.alert('Invalid Discount', 'Weekly discount must be between 0% and 50%');
      return;
    }

    if (monthly < 0 || monthly > 70) {
      Alert.alert('Invalid Discount', 'Monthly discount must be between 0% and 70%');
      return;
    }

    if (monthly <= weekly) {
      Alert.alert(
        'Invalid Discounts',
        'Monthly discount should be higher than weekly discount'
      );
      return;
    }

    // For now, just go back or show success
    Alert.alert('Success', 'Pricing saved successfully!');
    // TODO: Save to backend and navigate to next step
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Set Your Price</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Let our smart pricing help you maximize earnings while staying competitive
          </Text>
        </View>

        {/* Smart Pricing Widget */}
        {pricingFactors && (
          <SmartPricingWidget
            result={smartPrice}
            isLoading={isLoading}
            error={error}
            onAcceptPrice={handleApplySmartPrice}
          />
        )}

        {/* Manual Pricing Section */}
        <View style={styles.manualSection}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">Your Pricing</Text>
            {smartPrice && (
              <Button variant="ghost" onPress={handleApplySmartPrice} size="sm">
                Use Smart Price
              </Button>
            )}
          </View>

          {/* Daily Rate */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Daily Rate
            </Text>
            <Text variant="caption" color="secondary" style={styles.helperText}>
              How much you'll charge per day
            </Text>
            <View style={styles.priceInputContainer}>
              <Text variant="h3" style={styles.currencySymbol}>
                $
              </Text>
              <Input
                value={dailyRate}
                onChangeText={(text) => {
                  setDailyRate(text);
                  setUseSmartPricing(false);
                }}
                placeholder="0"
                keyboardType="decimal-pad"
                inputStyle={styles.priceInputText}
                containerStyle={styles.priceInputWrapper}
              />
            </View>
          </View>

          {/* Weekly Discount */}
          <View style={styles.inputGroup}>
            <Input
              label="Weekly Discount"
              helperText="Discount for trips 7+ days"
              value={weeklyDiscount}
              onChangeText={setWeeklyDiscount}
              placeholder="0"
              keyboardType="decimal-pad"
              rightIcon={<Text variant="h4">%</Text>}
            />
          </View>

          {/* Monthly Discount */}
          <View style={styles.inputGroup}>
            <Input
              label="Monthly Discount"
              helperText="Discount for trips 28+ days"
              value={monthlyDiscount}
              onChangeText={setMonthlyDiscount}
              placeholder="0"
              keyboardType="decimal-pad"
              rightIcon={<Text variant="h4">%</Text>}
            />
          </View>

          {/* Pricing Tips */}
          <View style={styles.tipsBox}>
            <Text variant="labelLarge" style={styles.tipsTitle}>
              Pricing Tips
            </Text>
            <Text variant="caption" color="secondary" style={styles.tipItem}>
              • Competitive pricing increases your booking rate by up to 40%
            </Text>
            <Text variant="caption" color="secondary" style={styles.tipItem}>
              • Weekly and monthly discounts encourage longer trips
            </Text>
            <Text variant="caption" color="secondary" style={styles.tipItem}>
              • You can adjust your price anytime based on demand
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            paddingBottom: insets.bottom + spacing['3'],
          },
        ]}
      >
        <Button onPress={handleContinue} disabled={!dailyRate} fullWidth>
          Continue to Availability
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    paddingBottom: spacing['24'],
  },
  header: {
    marginBottom: spacing['5'],
  },
  subtitle: {
    marginTop: spacing['2'],
  },
  manualSection: {
    marginTop: spacing['5'],
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  inputGroup: {
    marginBottom: spacing['5'],
  },
  label: {
    marginBottom: spacing['1'],
  },
  helperText: {
    marginBottom: spacing['2'],
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: palette.neutral[300],
    borderRadius: 12,
    paddingHorizontal: spacing['4'],
    height: 64,
  },
  currencySymbol: {
    color: palette.neutral[600],
    marginRight: spacing['2'],
  },
  priceInputWrapper: {
    flex: 1,
    borderWidth: 0,
  },
  priceInputText: {
    fontSize: 32,
    fontWeight: '600' as const,
  },
  tipsBox: {
    marginTop: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.primary[50],
    borderRadius: 12,
  },
  tipsTitle: {
    marginBottom: spacing['2'],
    color: palette.primary[700],
  },
  tipItem: {
    marginBottom: spacing['1'],
    lineHeight: 20,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
    shadowColor: palette.neutral[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
