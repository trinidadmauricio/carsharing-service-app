/**
 * Payment Page
 * Handles payment checkout via web browser
 */

import React, { useState, useEffect } from 'react';
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
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { PricingBreakdown } from '@/components/molecules/PricingBreakdown';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';
import { svc } from '@/services';
import type { CreateBookingRequest } from '@/types/booking';

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Helper to calculate days
function calculateDays(startDate: string, endDate: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / msPerDay);
}

export default function PaymentScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const params = useLocalSearchParams<{
    vehicleId: string;
    vehicleName: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    protectionPlanId: string;
    protectionPlanName: string;
    dailyRate: string;
    total: string;
    instantBook: string;
  }>();

  const {
    vehicleId,
    vehicleName,
    startDate,
    endDate,
    startTime,
    endTime,
    protectionPlanId,
    protectionPlanName,
    dailyRate,
    total,
    instantBook,
  } = params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Parse values
  const dailyRateNum = parseFloat(dailyRate || '0');
  const totalNum = parseFloat(total || '0');
  const isInstantBook = instantBook === 'true';
  const tripDays = calculateDays(startDate, endDate);

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: CreateBookingRequest) => {
      return await svc.bookings.createBooking(data);
    },
    onSuccess: (booking) => {
      setBookingId(booking.id);
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to create booking');
      setIsProcessing(false);
    },
  });

  // Create checkout mutation
  const createCheckoutMutation = useMutation({
    mutationFn: async (bookingIdParam: string) => {
      return await svc.bookings.createCheckout({ bookingId: bookingIdParam });
    },
    onSuccess: async (checkoutData) => {
      // Open checkout URL in browser
      try {
        const result = await WebBrowser.openBrowserAsync(
          checkoutData.checkoutUrl,
          {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
            controlsColor: palette.primary[500],
          }
        );

        if (result.type === 'cancel') {
          Alert.alert(
            'Payment Cancelled',
            'You cancelled the payment. Your booking is saved but not confirmed yet.'
          );
          setIsProcessing(false);
        }
        // Note: Success is handled via deep link
      } catch (error) {
        Alert.alert('Error', 'Failed to open payment page');
        setIsProcessing(false);
      }
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    },
  });

  // Handle deep link for payment result
  useEffect(() => {
    const handleDeepLink = (event: { url: string }): void => {
      const { url } = event;
      const parsed = Linking.parse(url);

      // Check if this is a payment result
      if (parsed.path === 'payment-result') {
        const status = parsed.queryParams?.status as string;
        const resultBookingId = parsed.queryParams?.bookingId as string;

        if (status === 'success' && resultBookingId) {
          // Navigate to success page
          router.replace({
            pathname: '/booking/success' as any,
            params: { bookingId: resultBookingId },
          });
        } else if (status === 'cancelled') {
          Alert.alert(
            'Payment Cancelled',
            'You cancelled the payment. Your booking is saved but not confirmed yet.'
          );
          setIsProcessing(false);
        } else {
          Alert.alert(
            'Payment Failed',
            'There was an error processing your payment. Please try again.'
          );
          setIsProcessing(false);
        }
      }
    };

    // Add deep link listener
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle payment initiation
  const handlePayNow = async (): Promise<void> => {
    setIsProcessing(true);

    try {
      // Step 1: Create booking
      const booking = await createBookingMutation.mutateAsync({
        vehicleId,
        startDate,
        endDate,
        startTime,
        endTime,
        protectionPlanId,
        instantBook: isInstantBook,
      });

      // Step 2: Create checkout session
      await createCheckoutMutation.mutateAsync(booking.id);
    } catch (error) {
      // Errors are handled in mutation callbacks
      console.error('Payment flow error:', error);
    }
  };

  // Handle back navigation
  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/booking/protection');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Confirm & Pay',
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
        {/* Trip Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.header}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={palette.primary[500]}
            />
            <Text variant="h3" style={{ color: colors.text.primary, marginLeft: spacing['2'] }}>
              Trip Summary
            </Text>
          </View>

          <Divider style={{ marginVertical: spacing['3'] }} />

          <View style={styles.infoRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Vehicle
            </Text>
            <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
              {vehicleName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Pick-up
            </Text>
            <Text variant="body2" style={{ color: colors.text.primary }}>
              {formatDate(startDate)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Drop-off
            </Text>
            <Text variant="body2" style={{ color: colors.text.primary }}>
              {formatDate(endDate)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Protection
            </Text>
            <Text variant="body2" style={{ color: colors.text.primary }}>
              {protectionPlanName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Booking Type
            </Text>
            <View style={styles.badgeContainer}>
              <Ionicons
                name={isInstantBook ? 'flash' : 'time-outline'}
                size={14}
                color={isInstantBook ? palette.warning[600] : palette.info[600]}
              />
              <Text
                variant="caption"
                style={{
                  color: isInstantBook ? palette.warning[600] : palette.info[600],
                  fontWeight: '600',
                  marginLeft: spacing['1'],
                }}
              >
                {isInstantBook ? 'Instant Book' : 'Request to Book'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Pricing Breakdown Card */}
        <Card style={styles.pricingCard}>
          <View style={styles.header}>
            <Ionicons
              name="card-outline"
              size={24}
              color={palette.primary[500]}
            />
            <Text variant="h3" style={{ color: colors.text.primary, marginLeft: spacing['2'] }}>
              Price Details
            </Text>
          </View>

          <Divider style={{ marginVertical: spacing['3'] }} />

          <PricingBreakdown
            dailyRate={dailyRateNum}
            tripDays={tripDays}
            subtotal={dailyRateNum * tripDays}
            protectionPlanPrice={(totalNum - dailyRateNum * tripDays) / 1.15 - dailyRateNum * tripDays}
            protectionPlanName={protectionPlanName}
            serviceFee={(dailyRateNum * tripDays) * 0.15}
            total={totalNum}
            showDetails={true}
          />
        </Card>

        {/* Important Notes */}
        <Card style={styles.notesCard}>
          <View style={styles.noteHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={palette.info[600]}
            />
            <Text
              variant="body2"
              style={{
                color: palette.info[900],
                fontWeight: '600',
                marginLeft: spacing['2'],
              }}
            >
              Important Notes
            </Text>
          </View>

          <Text
            variant="caption"
            style={{ color: palette.info[800], marginTop: spacing['2'], lineHeight: 18 }}
          >
            {isInstantBook
              ? '• Your booking will be confirmed immediately after payment.\n• You will be charged the full amount now.\n• Cancellation policy applies.'
              : '• Payment will be held but not charged until the host approves.\n• If declined, you will not be charged.\n• The host typically responds within 24 hours.'}
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
        <View style={styles.ctaContent}>
          <View style={styles.priceInfo}>
            <Text variant="caption" style={{ color: colors.text.tertiary }}>
              Total Amount
            </Text>
            <Text variant="h2" style={{ color: colors.text.primary }}>
              ${totalNum.toFixed(2)}
            </Text>
          </View>
          <Button
            variant="primary"
            size="lg"
            onPress={handlePayNow}
            disabled={isProcessing}
            style={styles.ctaButton}
          >
            {isProcessing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFF" />
                <Text variant="body1" style={{ color: '#FFF', marginLeft: spacing['2'] }}>
                  Processing...
                </Text>
              </View>
            ) : (
              'Pay Now'
            )}
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
  summaryCard: {
    margin: spacing['4'],
    marginBottom: spacing['3'],
    padding: spacing['4'],
  },
  pricingCard: {
    marginHorizontal: spacing['4'],
    marginBottom: spacing['3'],
    padding: spacing['4'],
  },
  notesCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.info[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
