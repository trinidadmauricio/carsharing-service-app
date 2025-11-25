/**
 * Vehicle Availability Screen
 * Configure Instant Book, guest requirements, and availability settings
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input } from '../../../components/atoms';
import { palette, spacing } from '@/theme';
import type { VehicleAvailability, GuestRequirements } from '../../../types';

export default function VehicleAvailabilityScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    dailyRate?: string;
    weeklyDiscount?: string;
    monthlyDiscount?: string;
  }>();

  // Instant Book state
  const [instantBookEnabled, setInstantBookEnabled] = useState<boolean>(true);

  // Guest Requirements
  const [minAge, setMinAge] = useState<string>('21');
  const [minTrips, setMinTrips] = useState<string>('0');
  const [minRating, setMinRating] = useState<string>('4.0');
  const [maxClaims, setMaxClaims] = useState<string>('2');
  const [requireIdVerification, setRequireIdVerification] = useState<boolean>(true);

  // Availability Settings
  const [advanceNotice, setAdvanceNotice] = useState<string>('2');
  const [minTripDuration, setMinTripDuration] = useState<string>('1');
  const [maxTripDuration, setMaxTripDuration] = useState<string>('30');

  const handleSubmit = (): void => {
    // Validation
    const age = parseInt(minAge, 10);
    const trips = parseInt(minTrips, 10);
    const rating = parseFloat(minRating);
    const claims = parseInt(maxClaims, 10);
    const notice = parseInt(advanceNotice, 10);
    const minDuration = parseInt(minTripDuration, 10);
    const maxDuration = parseInt(maxTripDuration, 10);

    if (age < 18 || age > 30) {
      Alert.alert('Invalid Age', 'Minimum age must be between 18 and 30');
      return;
    }

    if (rating < 0 || rating > 5) {
      Alert.alert('Invalid Rating', 'Minimum rating must be between 0 and 5');
      return;
    }

    if (minDuration > maxDuration) {
      Alert.alert(
        'Invalid Duration',
        'Minimum trip duration cannot be greater than maximum'
      );
      return;
    }

    // Build availability data
    const availability: VehicleAvailability = {
      blockedDates: [],
      advanceNotice: notice,
      minTripDuration: minDuration,
      maxTripDuration: maxDuration,
    };

    // Build guest requirements
    const guestRequirements: GuestRequirements = {
      minAge: age,
      minTrips: trips > 0 ? trips : undefined,
      minRating: rating > 0 ? rating : undefined,
      maxClaims: claims,
      idVerificationRequired: requireIdVerification,
    };

    // Success - navigate or save
    Alert.alert(
      'Success',
      'Vehicle listing created successfully! It will be reviewed within 24-48 hours.',
      [
        {
          text: 'View Dashboard',
          onPress: () => router.replace('/(host)/dashboard'),
        },
      ]
    );

    // TODO: Save to backend
    console.log('Availability:', availability);
    console.log('Guest Requirements:', guestRequirements);
    console.log('Instant Book:', instantBookEnabled);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Availability &amp; Rules</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Set your booking preferences and guest requirements
          </Text>
        </View>

        {/* Instant Book Section */}
        <View style={styles.section}>
          <View style={styles.instantBookHeader}>
            <View style={styles.instantBookInfo}>
              <Text variant="h3">Instant Book</Text>
              <Text variant="bodySmall" color="secondary" style={styles.instantBookDesc}>
                Let guests book immediately without your approval
              </Text>
            </View>
            <Switch
              value={instantBookEnabled}
              onValueChange={setInstantBookEnabled}
              trackColor={{
                false: palette.neutral[300],
                true: palette.primary[500],
              }}
              thumbColor="#ffffff"
              ios_backgroundColor={palette.neutral[300]}
            />
          </View>

          {instantBookEnabled && (
            <View style={styles.instantBookBenefits}>
              <Text variant="labelMedium" style={styles.benefitsTitle}>
                Benefits of Instant Book:
              </Text>
              <Text variant="caption" color="secondary" style={styles.benefitItem}>
                ✓ 3x more bookings on average
              </Text>
              <Text variant="caption" color="secondary" style={styles.benefitItem}>
                ✓ Higher search ranking
              </Text>
              <Text variant="caption" color="secondary" style={styles.benefitItem}>
                ✓ No missed opportunities from delayed responses
              </Text>
            </View>
          )}
        </View>

        {/* Guest Requirements */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Guest Requirements
          </Text>
          <Text variant="bodySmall" color="secondary" style={styles.sectionDesc}>
            Set minimum requirements for guests who can book your vehicle
          </Text>

          {/* Minimum Age */}
          <View style={styles.inputGroup}>
            <Input
              label="Minimum Age"
              helperText="Most hosts require 21+ years"
              value={minAge}
              onChangeText={setMinAge}
              keyboardType="number-pad"
              placeholder="21"
            />
          </View>

          {/* Minimum Trips */}
          <View style={styles.inputGroup}>
            <Input
              label="Minimum Trips (Optional)"
              helperText="Require guests to have completed trips. Leave 0 for new guests."
              value={minTrips}
              onChangeText={setMinTrips}
              keyboardType="number-pad"
              placeholder="0"
            />
          </View>

          {/* Minimum Rating */}
          <View style={styles.inputGroup}>
            <Input
              label="Minimum Rating (Optional)"
              helperText="Require a minimum guest rating (0-5 stars)"
              value={minRating}
              onChangeText={setMinRating}
              keyboardType="decimal-pad"
              placeholder="4.0"
            />
          </View>

          {/* Max Claims */}
          <View style={styles.inputGroup}>
            <Input
              label="Maximum Claims Allowed"
              helperText="Maximum number of previous claims allowed"
              value={maxClaims}
              onChangeText={setMaxClaims}
              keyboardType="number-pad"
              placeholder="2"
            />
          </View>

          {/* ID Verification */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text variant="labelLarge">Require ID Verification</Text>
              <Text variant="caption" color="secondary" style={styles.switchDesc}>
                Only allow verified guests to book
              </Text>
            </View>
            <Switch
              value={requireIdVerification}
              onValueChange={setRequireIdVerification}
              trackColor={{
                false: palette.neutral[300],
                true: palette.primary[500],
              }}
              thumbColor="#ffffff"
              ios_backgroundColor={palette.neutral[300]}
            />
          </View>
        </View>

        {/* Availability Settings */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Availability Settings
          </Text>

          {/* Advance Notice */}
          <View style={styles.inputGroup}>
            <Input
              label="Advance Notice (hours)"
              helperText="How far in advance guests must book"
              value={advanceNotice}
              onChangeText={setAdvanceNotice}
              keyboardType="number-pad"
              placeholder="2"
            />
            <View style={styles.quickOptions}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setAdvanceNotice('2')}
              >
                2 hrs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setAdvanceNotice('4')}
              >
                4 hrs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setAdvanceNotice('24')}
              >
                1 day
              </Button>
            </View>
          </View>

          {/* Trip Duration */}
          <View style={styles.inputGroup}>
            <Input
              label="Minimum Trip Duration (days)"
              helperText="Shortest trip length you'll accept"
              value={minTripDuration}
              onChangeText={setMinTripDuration}
              keyboardType="number-pad"
              placeholder="1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Input
              label="Maximum Trip Duration (days)"
              helperText="Longest trip length you'll accept"
              value={maxTripDuration}
              onChangeText={setMaxTripDuration}
              keyboardType="number-pad"
              placeholder="30"
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text variant="labelMedium" style={styles.infoTitle}>
            📅 Calendar Management
          </Text>
          <Text variant="caption" color="secondary" style={styles.infoText}>
            You can block specific dates and manage your availability calendar from your
            dashboard after your listing is approved.
          </Text>
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
        <Button onPress={handleSubmit} fullWidth>
          Complete Listing
        </Button>
      </View>
    </View>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: spacing['5'],
    marginBottom: spacing['4'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  sectionTitle: {
    marginBottom: spacing['2'],
  },
  sectionDesc: {
    marginBottom: spacing['4'],
  },
  instantBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instantBookInfo: {
    flex: 1,
    marginRight: spacing['4'],
  },
  instantBookDesc: {
    marginTop: spacing['1'],
  },
  instantBookBenefits: {
    marginTop: spacing['4'],
    padding: spacing['3'],
    backgroundColor: palette.primary[50],
    borderRadius: 12,
  },
  benefitsTitle: {
    marginBottom: spacing['2'],
    color: palette.primary[700],
  },
  benefitItem: {
    marginBottom: spacing['1'],
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: spacing['4'],
  },
  quickOptions: {
    flexDirection: 'row',
    gap: spacing['2'],
    marginTop: spacing['2'],
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing['4'],
  },
  switchDesc: {
    marginTop: spacing['1'],
  },
  infoBox: {
    padding: spacing['4'],
    backgroundColor: palette.info[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.info[200],
  },
  infoTitle: {
    marginBottom: spacing['2'],
    color: palette.info[700],
  },
  infoText: {
    lineHeight: 20,
    color: palette.info[600],
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
    ...Platform.select({
      ios: {
        shadowColor: palette.neutral[900],
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
