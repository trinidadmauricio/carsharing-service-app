/**
 * Protection Plan Selection Page
 * Choose protection coverage for the booking
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { ProtectionSelector } from '@/components/organisms/ProtectionSelector';
import { PricingBreakdown } from '@/components/molecules/PricingBreakdown';
import { useThemeColors, palette } from '@/theme';
import { spacing, borderRadius } from '@/theme/spacing';
import { useVehicleDetail } from '@/hooks';
import { formatCurrency } from '@/hooks/useProtectionPlans';
import type { ProtectionPlan } from '@/types/protection';

// Helper to calculate days between dates
function calculateDays(startDate: string, endDate: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / msPerDay);
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProtectionSelectionScreen(): React.ReactElement {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    vehicleId: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }>();

  const { vehicleId, startDate, endDate, startTime, endTime } = params;

  // Fetch vehicle details
  const { data: vehicle, isLoading: vehicleLoading } = useVehicleDetail(vehicleId);

  // Calculate trip duration
  const tripDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    return calculateDays(startDate, endDate);
  }, [startDate, endDate]);

  // Selected protection plan state
  const [selectedPlan, setSelectedPlan] = useState<ProtectionPlan | null>(null);

  // Calculate pricing
  const dailyRate = vehicle ? vehicle.pricing.dailyRate : 0;
  const subtotal = dailyRate * tripDays;
  const protectionPrice = selectedPlan?.price ? selectedPlan.price * tripDays : 0;
  const serviceFee = subtotal * 0.15; // 15% service fee
  const totalPrice = subtotal + protectionPrice + serviceFee;

  // Handle plan selection
  const handlePlanSelected = (plan: ProtectionPlan): void => {
    setSelectedPlan(plan);
  };

  // Handle continue to payment
  const handleContinue = (): void => {
    if (!selectedPlan) {
      Alert.alert('Protection Required', 'Please select a protection plan to continue.');
      return;
    }

    // Navigate to payment screen
    // TODO: Implement payment screen route
    // router.push({
    //   pathname: '/booking/payment',
    //   params: {
    //     vehicleId,
    //     startDate,
    //     endDate,
    //     startTime,
    //     endTime,
    //     protectionPlanId: selectedPlan.id,
    //   },
    // });

    Alert.alert(
      'Coming Soon',
      'Payment integration will be implemented in the next sprint.'
    );
  };

  // Handle back navigation
  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/booking/${vehicleId}`);
    }
  };

  if (vehicleLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Choose Protection',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.interactive.primary} />
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Choose Protection',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={palette.error[500]} />
          <Text variant="h3" style={{ color: colors.text.primary, marginTop: spacing['3'] }}>
            Vehicle Not Found
          </Text>
          <Button
            variant="primary"
            size="md"
            onPress={handleBack}
            style={{ marginTop: spacing['4'] }}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

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
          { paddingTop: spacing['2'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.vehicleInfo}>
            <Text variant="h3" style={{ color: colors.text.primary }}>
              {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </Text>
            <Text variant="body2" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </Text>
            <Text variant="caption" style={{ color: colors.text.tertiary, marginTop: spacing['1'] }}>
              {`${tripDays} ${tripDays === 1 ? 'day' : 'days'}`}
            </Text>
          </View>

          <Divider style={{ marginVertical: spacing['3'] }} />

          {/* Pricing Breakdown */}
          <PricingBreakdown
            dailyRate={dailyRate}
            tripDays={tripDays}
            subtotal={subtotal}
            protectionPlanPrice={protectionPrice}
            protectionPlanName={selectedPlan?.name}
            serviceFee={serviceFee}
            total={totalPrice}
            showDetails={true}
          />
        </Card>

        {/* Protection Selector */}
        <View style={styles.selectorContainer}>
          <ProtectionSelector
            type="guest"
            tripDays={tripDays}
            onPlanSelected={handlePlanSelected}
          />
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
        <View style={styles.ctaContent}>
          <View style={styles.priceInfo}>
            <Text variant="caption" style={{ color: colors.text.tertiary }}>
              Total
            </Text>
            <Text variant="h2" style={{ color: colors.text.primary }}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>
          <Button
            variant="primary"
            size="lg"
            onPress={handleContinue}
            disabled={!selectedPlan}
            style={styles.ctaButton}
          >
            Continue to Payment
          </Button>
        </View>
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
    paddingBottom: spacing['4'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
  },
  summaryCard: {
    margin: spacing['4'],
    padding: spacing['4'],
  },
  vehicleInfo: {
    gap: spacing['1'],
  },
  selectorContainer: {
    paddingHorizontal: spacing['4'],
  },
  bottomCTA: {
    borderTopWidth: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
  },
  priceInfo: {
    flex: 1,
  },
  ctaButton: {
    flex: 2,
  },
});
