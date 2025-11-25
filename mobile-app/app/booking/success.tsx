/**
 * Booking Success Page
 * Confirmation page after successful payment
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { useQuery } from '@tanstack/react-query';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';
import { svc } from '@/services';

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Helper to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function BookingSuccessScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    bookingId: string;
  }>();

  const { bookingId } = params;

  const [calendarAdded, setCalendarAdded] = useState(false);

  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      return await svc.bookings.getById(bookingId);
    },
    enabled: !!bookingId,
  });

  // Handle add to calendar
  const handleAddToCalendar = async (): Promise<void> => {
    if (!booking) return;

    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Calendar permission is required to add this event.'
        );
        return;
      }

      // Get default calendar
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar available for adding events.');
        return;
      }

      // Create calendar event
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Car Rental - ${bookingId}`,
        notes: `Protection Plan: ${booking.protectionPlan.name}\nTotal: $${booking.pricing.total.toFixed(2)}`,
        startDate,
        endDate,
        timeZone: 'America/El_Salvador',
      });

      setCalendarAdded(true);
      Alert.alert('Success', 'Booking added to your calendar!');
    } catch (error) {
      console.error('Calendar error:', error);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  // Handle navigation
  const handleViewBooking = (): void => {
    router.replace(`/trips/${bookingId}` as any);
  };

  const handleBackHome = (): void => {
    router.replace('/(tabs)');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.interactive.primary} />
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Booking Not Found',
          }}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={palette.error[500]} />
          <Text variant="h3" style={{ color: colors.text.primary, marginTop: spacing['3'] }}>
            Booking Not Found
          </Text>
          <Button
            variant="primary"
            size="md"
            onPress={handleBackHome}
            style={{ marginTop: spacing['4'] }}
          >
            Go Home
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing['6'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View
            style={[
              styles.successIconCircle,
              { backgroundColor: palette.success[100] },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={80}
              color={palette.success[600]}
            />
          </View>
        </View>

        {/* Success Message */}
        <Text
          variant="h1"
          style={{ color: colors.text.primary, textAlign: 'center', marginTop: spacing['4'] }}
        >
          Booking Confirmed!
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
          {booking.instantBook
            ? 'Your booking is confirmed and ready to go!'
            : 'Your payment is held. The host will review your request.'}
        </Text>

        {/* Booking Reference */}
        <Card style={styles.referenceCard}>
          <Text
            variant="caption"
            style={{ color: palette.primary[700], textAlign: 'center' }}
          >
            Booking Reference
          </Text>
          <Text
            variant="h3"
            style={{
              color: palette.primary[900],
              textAlign: 'center',
              marginTop: spacing['1'],
              fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            }}
          >
            {bookingId.toUpperCase()}
          </Text>
        </Card>

        {/* Booking Details Card */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text variant="body2" style={{ color: colors.text.secondary, marginLeft: spacing['2'] }}>
                Pick-up
              </Text>
            </View>
            <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
              {formatDate(booking.startDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text variant="body2" style={{ color: colors.text.secondary, marginLeft: spacing['2'] }}>
                Drop-off
              </Text>
            </View>
            <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
              {formatDate(booking.endDate)}
            </Text>
          </View>

          <Divider style={{ marginVertical: spacing['3'] }} />

          <View style={styles.detailRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Protection Plan
            </Text>
            <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
              {booking.protectionPlan.name}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              Total Paid
            </Text>
            <Text variant="h3" style={{ color: palette.success[600] }}>
              ${booking.pricing.total.toFixed(2)}
            </Text>
          </View>
        </Card>

        {/* Next Steps Card */}
        <Card style={styles.nextStepsCard}>
          <Text variant="h3" style={{ color: colors.text.primary }}>
            What's Next?
          </Text>
          <Divider style={{ marginVertical: spacing['3'] }} />

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[100] }]}>
              <Text variant="body2" style={{ color: palette.primary[700], fontWeight: '600' }}>
                1
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                Check your email
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                We've sent you a confirmation with all the details
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[100] }]}>
              <Text variant="body2" style={{ color: palette.primary[700], fontWeight: '600' }}>
                2
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                {booking.instantBook ? 'Prepare for your trip' : 'Wait for host approval'}
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                {booking.instantBook
                  ? 'Review the pickup instructions and prepare necessary documents'
                  : 'The host will review your request within 24 hours'}
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: palette.primary[100] }]}>
              <Text variant="body2" style={{ color: palette.primary[700], fontWeight: '600' }}>
                3
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600' }}>
                Pick up your vehicle
              </Text>
              <Text variant="caption" style={{ color: colors.text.secondary, marginTop: spacing['1'] }}>
                Meet the host at the scheduled time and complete the trip photos
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom CTAs */}
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
          variant="outline"
          size="lg"
          onPress={handleAddToCalendar}
          disabled={calendarAdded}
          style={styles.calendarButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name={calendarAdded ? 'checkmark' : 'calendar-outline'}
              size={20}
              color={calendarAdded ? palette.success[600] : palette.primary[600]}
            />
            <Text
              variant="body1"
              style={{
                color: calendarAdded ? palette.success[600] : palette.primary[600],
                fontWeight: '600',
                marginLeft: spacing['2'],
              }}
            >
              {calendarAdded ? 'Added to Calendar' : 'Add to Calendar'}
            </Text>
          </View>
        </Button>

        <Button
          variant="primary"
          size="lg"
          onPress={handleBackHome}
          style={styles.homeButton}
        >
          Back to Home
        </Button>
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
  successIconContainer: {
    alignItems: 'center',
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referenceCard: {
    marginHorizontal: spacing['6'],
    marginTop: spacing['6'],
    padding: spacing['4'],
    backgroundColor: palette.primary[50],
  },
  detailsCard: {
    marginHorizontal: spacing['4'],
    marginTop: spacing['4'],
    padding: spacing['4'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStepsCard: {
    marginHorizontal: spacing['4'],
    marginTop: spacing['4'],
    padding: spacing['4'],
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing['4'],
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    gap: spacing['3'],
  },
  calendarButton: {
    width: '100%',
  },
  homeButton: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
