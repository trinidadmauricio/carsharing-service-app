/**
 * Vehicle Location Screen
 * Set pickup location for vehicle
 */

import React, { useState } from 'react';
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
import { palette, spacing } from '@/theme';

// El Salvador cities
const EL_SALVADOR_CITIES = [
  'San Salvador',
  'Santa Ana',
  'San Miguel',
  'Santa Tecla',
  'Soyapango',
  'Mejicanos',
  'Apopa',
  'Delgado',
  'Sonsonate',
  'Ahuachapán',
];

export default function VehicleLocationScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Location state
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('San Salvador');
  const [state] = useState<string>('San Salvador'); // El Salvador department
  const [zipCode, setZipCode] = useState<string>('');
  const [pickupInstructions, setPickupInstructions] = useState<string>('');

  // Coordinates (would come from map picker in real implementation)
  const [latitude] = useState<number>(13.6929); // San Salvador default
  const [longitude] = useState<number>(-89.2182);

  const handleContinue = (): void => {
    // Validation
    if (!address || address.length < 10) {
      Alert.alert('Invalid Address', 'Please enter a complete street address');
      return;
    }

    if (!city) {
      Alert.alert('Invalid City', 'Please select a city');
      return;
    }

    if (!zipCode || zipCode.length < 4) {
      Alert.alert('Invalid ZIP Code', 'Please enter a valid ZIP code');
      return;
    }

    // Success - would normally save to backend and continue to next step
    Alert.alert(
      'Success',
      `Location saved!\n\n${address}\n${city}, ${state} ${zipCode}\n\nYour vehicle listing is complete!`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to host dashboard
            router.replace('/(tabs)/host');
          },
        },
      ]
    );
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
          <Text variant="h2">Vehicle Location</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Where will guests pick up your vehicle?
          </Text>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text variant="bodyMedium" color="secondary" style={styles.mapText}>
            📍 Map View
          </Text>
          <Text variant="caption" color="secondary" style={styles.mapSubtext}>
            (Map integration coming soon)
          </Text>
          <View style={styles.coordinatesBox}>
            <Text variant="caption" color="secondary">
              Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Address Form */}
        <View style={styles.form}>
          <Input
            label="Street Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Calle Principal #123"
            required
            helperText="Full street address with number"
            multiline
            numberOfLines={2}
          />

          {/* City Selector */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              City *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cityScroll}
              contentContainerStyle={styles.cityScrollContent}
            >
              {EL_SALVADOR_CITIES.map((c) => (
                <Button
                  key={c}
                  variant={city === c ? 'primary' : 'outline'}
                  onPress={() => setCity(c)}
                  size="sm"
                  style={styles.cityButton}
                >
                  {c}
                </Button>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <Input
              label="Department"
              value={state}
              editable={false}
              containerStyle={styles.mediumInput}
            />
            <Input
              label="ZIP Code"
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="1101"
              keyboardType="numeric"
              maxLength={5}
              required
              containerStyle={styles.smallInput}
            />
          </View>

          <Input
            label="Pickup Instructions (Optional)"
            value={pickupInstructions}
            onChangeText={setPickupInstructions}
            placeholder="e.g., Park in spot #5, call when you arrive"
            multiline
            numberOfLines={3}
            helperText="Help guests find and access your vehicle"
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text variant="labelLarge" style={styles.infoTitle}>
            Location Privacy
          </Text>
          <Text variant="caption" color="secondary" style={styles.infoText}>
            Your exact address is only shared with confirmed guests. Your listing will show the
            general area to potential guests.
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
        <Button onPress={handleContinue} disabled={!address || !city || !zipCode} fullWidth>
          Complete Listing
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
  mapPlaceholder: {
    height: 200,
    backgroundColor: palette.neutral[100],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['5'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  mapText: {
    fontSize: 24,
    marginBottom: spacing['2'],
  },
  mapSubtext: {
    marginBottom: spacing['3'],
  },
  coordinatesBox: {
    backgroundColor: palette.neutral[50],
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: 6,
  },
  form: {
    gap: spacing['4'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  smallInput: {
    flex: 0.4,
  },
  mediumInput: {
    flex: 0.6,
  },
  inputGroup: {
    marginBottom: spacing['4'],
  },
  label: {
    marginBottom: spacing['2'],
  },
  cityScroll: {
    marginHorizontal: -spacing['4'],
    paddingHorizontal: spacing['4'],
  },
  cityScrollContent: {
    paddingHorizontal: spacing['4'],
    gap: spacing['2'],
  },
  cityButton: {
    minWidth: 100,
  },
  infoBox: {
    marginTop: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.info[50],
    borderRadius: 12,
  },
  infoTitle: {
    marginBottom: spacing['2'],
    color: palette.info[700],
  },
  infoText: {
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
