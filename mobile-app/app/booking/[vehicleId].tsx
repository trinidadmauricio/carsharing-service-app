/**
 * Booking Confirmation Page
 * Review trip details and check eligibility before proceeding to protection plans
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Divider } from '@/components/atoms/Divider';
import { PricingBreakdown } from '@/components/molecules/PricingBreakdown';
import { useThemeColors, palette, spacing, borderRadius, shadows } from '@/theme';
import { useVehicleDetail, useBookingEligibility } from '@/hooks';
import type { DateTimeRange } from '@/types';

// Helper to calculate days between dates
function calculateDays(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffMs / msPerDay);
}

// Helper to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Helper to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function BookingConfirmPage() {
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ vehicleId: string }>();
  const vehicleId = params.vehicleId;
  const insets = useSafeAreaInsets();

  // Date state (default to tomorrow 10AM - day after 10AM)
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    return date;
  }, []);

  const dayAfter = useMemo(() => {
    const date = new Date(tomorrow);
    date.setDate(date.getDate() + 1);
    return date;
  }, [tomorrow]);

  const [startDate, setStartDate] = useState<Date>(tomorrow);
  const [endDate, setEndDate] = useState<Date>(dayAfter);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Fetch vehicle data
  const { data: vehicle, isLoading: vehicleLoading, isError: vehicleError } = useVehicleDetail(vehicleId);

  // Check booking eligibility (runs in background)
  const {
    eligibility,
    isLoading: eligibilityLoading,
    isError: eligibilityError,
    canBook,
    canInstantBook,
    requiresApproval,
    blockedReason,
  } = useBookingEligibility({
    vehicleId,
    vehicleInstantBook: vehicle?.instantBookEnabled ?? false,
    enabled: !!vehicle,
  });

  // Calculate pricing
  const tripDays = useMemo(() => calculateDays(startDate, endDate), [startDate, endDate]);

  const pricing = useMemo(() => {
    if (!vehicle) return null;

    const dailyRate = vehicle.pricing.dailyRate;
    const subtotal = dailyRate * tripDays;

    // Apply weekly discount if applicable
    let discount = 0;
    if (tripDays >= 7 && vehicle.pricing.weeklyDiscount) {
      discount = subtotal * (vehicle.pricing.weeklyDiscount / 100);
    } else if (tripDays >= 30 && vehicle.pricing.monthlyDiscount) {
      discount = subtotal * (vehicle.pricing.monthlyDiscount / 100);
    }

    const subtotalAfterDiscount = subtotal - discount;
    const serviceFee = subtotalAfterDiscount * 0.10; // 10% service fee
    const total = subtotalAfterDiscount + serviceFee;

    return {
      dailyRate,
      tripDays,
      subtotal,
      discount,
      serviceFee,
      total,
      discountPercentage: vehicle.pricing.weeklyDiscount,
    };
  }, [vehicle, tripDays]);

  // Handle date changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // Ensure end date is after start date
      if (selectedDate >= endDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate && selectedDate > startDate) {
      setEndDate(selectedDate);
    }
  };

  // Handle proceed to protection
  const handleProceed = () => {
    if (vehicle && pricing) {
      router.push({
        pathname: '/booking/protection',
        params: {
          vehicleId: vehicle.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
    }
  };

  if (vehicleLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen options={{ title: 'Confirm Booking' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary[500]} />
          <Text variant="body1" style={styles.loadingText}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (vehicleError || !vehicle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen options={{ title: 'Confirm Booking' }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={palette.red[400]} />
          <Text variant="h3" style={styles.errorTitle}>
            Unable to load vehicle
          </Text>
          <Text variant="body1" style={styles.errorText}>
            We couldn't find the vehicle you're trying to book.
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Go back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          title: 'Confirm Booking',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Vehicle Summary Card */}
        <Card variant="elevated" style={styles.vehicleCard}>
          <View style={styles.vehicleContent}>
            <Image
              source={{ uri: vehicle.primaryPhotoUrl }}
              style={styles.vehicleImage}
              resizeMode="cover"
            />
            <View style={styles.vehicleInfo}>
              <Text variant="h4" numberOfLines={1}>
                {vehicle.year} {vehicle.make}
              </Text>
              <Text variant="body2" numberOfLines={1} style={styles.vehicleModel}>
                {vehicle.model}
              </Text>
              <View style={styles.vehicleMeta}>
                <Ionicons name="star" size={14} color={palette.yellow[500]} />
                <Text variant="caption" style={styles.rating}>
                  {vehicle.rating.toFixed(1)} ({vehicle.reviewCount})
                </Text>
              </View>
              {vehicle.instantBookEnabled && (
                <Badge variant="primary" size="sm" style={styles.instantBadge}>
                  <Ionicons name="flash" size={12} color="#FFFFFF" /> Instant Book
                </Badge>
              )}
            </View>
          </View>
        </Card>

        {/* Trip Dates */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Trip Details
          </Text>

          <Card variant="outlined" style={styles.dateCard}>
            {/* Start Date */}
            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={styles.dateRow}
            >
              <View style={styles.dateIcon}>
                <Ionicons name="calendar-outline" size={24} color={palette.primary[500]} />
              </View>
              <View style={styles.dateInfo}>
                <Text variant="caption" style={styles.dateLabel}>
                  Pick-up
                </Text>
                <Text variant="body1" style={styles.dateValue}>
                  {formatDate(startDate)}
                </Text>
                <Text variant="caption" style={styles.timeValue}>
                  {formatTime(startDate)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={palette.gray[400]} />
            </Pressable>

            <Divider style={styles.dateDivider} />

            {/* End Date */}
            <Pressable
              onPress={() => setShowEndPicker(true)}
              style={styles.dateRow}
            >
              <View style={styles.dateIcon}>
                <Ionicons name="calendar-outline" size={24} color={palette.primary[500]} />
              </View>
              <View style={styles.dateInfo}>
                <Text variant="caption" style={styles.dateLabel}>
                  Drop-off
                </Text>
                <Text variant="body1" style={styles.dateValue}>
                  {formatDate(endDate)}
                </Text>
                <Text variant="caption" style={styles.timeValue}>
                  {formatTime(endDate)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={palette.gray[400]} />
            </Pressable>
          </Card>

          {/* Trip Duration */}
          <View style={styles.durationBadge}>
            <Text variant="body2" style={styles.durationText}>
              {tripDays} {tripDays === 1 ? 'day' : 'days'} rental
            </Text>
          </View>
        </View>

        {/* Eligibility Status */}
        <View style={styles.section}>
          {eligibilityLoading && (
            <Card variant="outlined" style={styles.eligibilityCard}>
              <View style={styles.eligibilityLoading}>
                <ActivityIndicator size="small" color={palette.primary[500]} />
                <Text variant="body2" style={styles.eligibilityLoadingText}>
                  Checking eligibility...
                </Text>
              </View>
            </Card>
          )}

          {!eligibilityLoading && eligibilityError && (
            <Card variant="outlined" style={StyleSheet.flatten([styles.eligibilityCard, styles.infoCard])}>
              <View style={styles.eligibilityHeader}>
                <Ionicons name="information-circle" size={24} color={palette.info[500]} />
                <Text variant="h4" style={styles.infoTitle}>
                  Ready to Book
                </Text>
              </View>
              <Text variant="body2" style={styles.infoText}>
                Continue to select your protection plan and confirm your booking.
              </Text>
            </Card>
          )}

          {!eligibilityLoading && !eligibilityError && blockedReason && (
            <Card variant="outlined" style={StyleSheet.flatten([styles.eligibilityCard, styles.blockedCard])}>
              <View style={styles.eligibilityHeader}>
                <Ionicons name="alert-circle" size={24} color={palette.red[500]} />
                <Text variant="h4" style={styles.blockedTitle}>
                  Booking Not Available
                </Text>
              </View>
              <Text variant="body2" style={styles.blockedReason}>
                {blockedReason}
              </Text>
            </Card>
          )}

          {!eligibilityLoading && !eligibilityError && canBook && (
            <Card variant="outlined" style={StyleSheet.flatten([styles.eligibilityCard, styles.approvedCard])}>
              <View style={styles.eligibilityHeader}>
                <Ionicons
                  name={canInstantBook ? 'flash' : 'checkmark-circle'}
                  size={24}
                  color={canInstantBook ? palette.primary[500] : palette.green[500]}
                />
                <Text variant="h4" style={styles.approvedTitle}>
                  {canInstantBook ? 'Instant Book Available' : 'Booking Requires Approval'}
                </Text>
              </View>
              <Text variant="body2" style={styles.approvedText}>
                {canInstantBook
                  ? 'You can confirm this booking instantly and receive immediate confirmation.'
                  : 'Your booking request will be sent to the host for approval. You\'ll receive a response within 24 hours.'}
              </Text>

              {/* Risk Score Info */}
              {eligibility && (
                <View style={styles.riskInfo}>
                  <Divider style={styles.riskDivider} />
                  <View style={styles.riskHeader}>
                    <Text variant="caption" style={styles.riskLabel}>
                      Trust Score: {eligibility.riskScore.score}/100
                    </Text>
                    <Badge
                      variant={
                        eligibility.riskScore.level === 'low'
                          ? 'success'
                          : eligibility.riskScore.level === 'medium'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {eligibility.riskScore.level.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </View>
                  {eligibility.restrictions.length > 0 && (
                    <View style={styles.restrictions}>
                      {eligibility.restrictions.map((restriction, idx) => (
                        <View key={idx} style={styles.restrictionItem}>
                          <Ionicons name="information-circle-outline" size={14} color={palette.gray[600]} />
                          <Text variant="caption" style={styles.restrictionText}>
                            {restriction}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </Card>
          )}
        </View>

        {/* Pricing Breakdown */}
        {pricing && (
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              Price Details
            </Text>
            <PricingBreakdown
              dailyRate={pricing.dailyRate}
              tripDays={pricing.tripDays}
              subtotal={pricing.subtotal}
              discount={pricing.discount}
              discountPercentage={pricing.discountPercentage}
              serviceFee={pricing.serviceFee}
              total={pricing.total}
              protectionPlanPrice={0} // Will be added in next step
            />
          </View>
        )}

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={startDate}
        />
      )}

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, {
        backgroundColor: colors.background.primary,
        paddingBottom: insets.bottom + spacing['3']
      }]}>
        {pricing && (
          <View style={styles.ctaLeft}>
            <Text variant="caption" style={styles.ctaLabel}>
              Total (before protection)
            </Text>
            <Text variant="h3" style={styles.ctaPrice}>
              ${pricing.total.toFixed(2)}
            </Text>
          </View>
        )}
        <Button
          onPress={handleProceed}
          disabled={(!canBook && !eligibilityError) || eligibilityLoading}
          style={styles.proceedButton}
        >
          {canInstantBook ? 'Continue' : 'Continue'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['6'],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing['4'],
    color: palette.gray[600],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['6'],
  },
  errorTitle: {
    marginTop: spacing['4'],
    marginBottom: spacing['2'],
  },
  errorText: {
    textAlign: 'center',
    color: palette.gray[600],
    marginBottom: spacing['6'],
  },
  backButton: {
    minWidth: 120,
  },
  vehicleCard: {
    padding: spacing['3'],
    marginBottom: spacing['4'],
  },
  vehicleContent: {
    flexDirection: 'row',
  },
  vehicleImage: {
    width: 100,
    height: 75,
    borderRadius: borderRadius.md,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  vehicleModel: {
    color: palette.gray[600],
    marginBottom: spacing['1'],
  },
  vehicleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['1'],
  },
  rating: {
    marginLeft: spacing['1'],
    color: palette.gray[600],
  },
  instantBadge: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: spacing['4'],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  dateCard: {
    padding: spacing['3'],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  dateIcon: {
    marginRight: spacing['3'],
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    color: palette.gray[500],
    marginBottom: spacing['0.5'],
  },
  dateValue: {
    fontWeight: '600',
    marginBottom: spacing['0.5'],
  },
  timeValue: {
    color: palette.gray[600],
  },
  dateDivider: {
    marginVertical: spacing['2'],
  },
  durationBadge: {
    marginTop: spacing['2'],
    alignSelf: 'center',
    backgroundColor: palette.primary[50],
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.full,
  },
  durationText: {
    color: palette.primary[700],
    fontWeight: '600',
  },
  eligibilityCard: {
    padding: spacing['4'],
    marginBottom: spacing['4'],
  },
  eligibilityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eligibilityLoadingText: {
    marginLeft: spacing['2'],
    color: palette.gray[600],
  },
  blockedCard: {
    borderColor: palette.red[200],
    backgroundColor: palette.red[50],
  },
  eligibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  blockedTitle: {
    marginLeft: spacing['2'],
    color: palette.red[700],
  },
  blockedReason: {
    color: palette.red[600],
  },
  approvedCard: {
    borderColor: palette.green[200],
    backgroundColor: palette.green[50],
  },
  approvedTitle: {
    marginLeft: spacing['2'],
    color: palette.green[700],
  },
  approvedText: {
    color: palette.gray[700],
  },
  infoCard: {
    borderColor: palette.info[200],
    backgroundColor: palette.info[50],
  },
  infoTitle: {
    marginLeft: spacing['2'],
    color: palette.info[700],
  },
  infoText: {
    color: palette.gray[700],
  },
  riskInfo: {
    marginTop: spacing['3'],
  },
  riskDivider: {
    marginBottom: spacing['2'],
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  riskLabel: {
    color: palette.gray[600],
    fontWeight: '600',
  },
  restrictions: {
    gap: spacing['1'],
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['1'],
  },
  restrictionText: {
    flex: 1,
    color: palette.gray[600],
  },
  bottomSpacer: {
    height: 100,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderTopWidth: 1,
    borderTopColor: palette.gray[200],
    ...shadows.lg,
  },
  ctaLeft: {
    flex: 1,
  },
  ctaLabel: {
    color: palette.gray[600],
    marginBottom: spacing['0.5'],
  },
  ctaPrice: {
    color: palette.primary[600],
  },
  proceedButton: {
    minWidth: 140,
  },
});
