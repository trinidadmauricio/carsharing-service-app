/**
 * Vehicle Info Screen
 * Basic vehicle information form for host listing
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
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Input } from '../../../components/atoms';
import { palette, spacing } from '@/theme';
import type { VehicleBasicInfo } from '../../../types';

const VEHICLE_MAKES = [
  'Toyota',
  'Honda',
  'Nissan',
  'Hyundai',
  'Kia',
  'Mazda',
  'Chevrolet',
  'Ford',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
];

const TRANSMISSION_TYPES = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
] as const;

const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

export default function VehicleInfoScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Form state
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [trim, setTrim] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [odometer, setOdometer] = useState<string>('');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'electric' | 'hybrid'>(
    'gasoline'
  );
  const [seats, setSeats] = useState<string>('5');
  const [doors, setDoors] = useState<string>('4');

  const handleContinue = (): void => {
    // Validation
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(year, 10);

    if (!year || isNaN(vehicleYear) || vehicleYear < 1990 || vehicleYear > currentYear + 1) {
      Alert.alert('Invalid Year', `Year must be between 1990 and ${currentYear + 1}`);
      return;
    }

    if (!make || make.length < 2) {
      Alert.alert('Invalid Make', 'Please enter the vehicle make');
      return;
    }

    if (!model || model.length < 1) {
      Alert.alert('Invalid Model', 'Please enter the vehicle model');
      return;
    }

    if (!vin || vin.length !== 17) {
      Alert.alert('Invalid VIN', 'VIN must be exactly 17 characters');
      return;
    }

    if (!licensePlate || licensePlate.length < 4) {
      Alert.alert('Invalid License Plate', 'Please enter a valid license plate');
      return;
    }

    if (!color) {
      Alert.alert('Invalid Color', 'Please enter the vehicle color');
      return;
    }

    const odometerValue = parseInt(odometer, 10);
    if (!odometer || isNaN(odometerValue) || odometerValue < 0) {
      Alert.alert('Invalid Odometer', 'Please enter a valid odometer reading');
      return;
    }

    const seatsValue = parseInt(seats, 10);
    if (!seats || isNaN(seatsValue) || seatsValue < 2 || seatsValue > 9) {
      Alert.alert('Invalid Seats', 'Seats must be between 2 and 9');
      return;
    }

    const doorsValue = parseInt(doors, 10);
    if (!doors || isNaN(doorsValue) || doorsValue < 2 || doorsValue > 5) {
      Alert.alert('Invalid Doors', 'Doors must be between 2 and 5');
      return;
    }

    // Navigate to photos screen with vehicle info
    // TODO: Implement photos screen
    Alert.alert(
      'Success',
      `Vehicle information saved!\n\n${year} ${make} ${model}\nVIN: ${vin}\n\nNext: Add photos`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
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
          <Text variant="h2">Vehicle Information</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Tell us about your vehicle
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Year, Make, Model Row */}
          <View style={styles.row}>
            <Input
              label="Year"
              value={year}
              onChangeText={setYear}
              placeholder="2024"
              keyboardType="numeric"
              maxLength={4}
              required
              containerStyle={styles.smallInput}
            />
            <Input
              label="Make"
              value={make}
              onChangeText={setMake}
              placeholder="Toyota"
              required
              containerStyle={styles.largeInput}
            />
          </View>

          <Input
            label="Model"
            value={model}
            onChangeText={setModel}
            placeholder="Corolla"
            required
          />

          <Input
            label="Trim (Optional)"
            value={trim}
            onChangeText={setTrim}
            placeholder="LE, Sport, etc."
          />

          {/* VIN */}
          <Input
            label="VIN"
            value={vin}
            onChangeText={(text) => setVin(text.toUpperCase())}
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
            autoCapitalize="characters"
            required
            helperText="17-character Vehicle Identification Number"
          />

          {/* License Plate */}
          <Input
            label="License Plate"
            value={licensePlate}
            onChangeText={(text) => setLicensePlate(text.toUpperCase())}
            placeholder="ABC123"
            autoCapitalize="characters"
            required
          />

          {/* Color & Odometer */}
          <View style={styles.row}>
            <Input
              label="Color"
              value={color}
              onChangeText={setColor}
              placeholder="White"
              required
              containerStyle={styles.mediumInput}
            />
            <Input
              label="Odometer (mi)"
              value={odometer}
              onChangeText={setOdometer}
              placeholder="25000"
              keyboardType="numeric"
              required
              containerStyle={styles.mediumInput}
            />
          </View>

          {/* Transmission */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Transmission *
            </Text>
            <View style={styles.radioGroup}>
              {TRANSMISSION_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={transmission === type.value ? 'primary' : 'outline'}
                  onPress={() => setTransmission(type.value)}
                  style={styles.radioButton}
                >
                  {type.label}
                </Button>
              ))}
            </View>
          </View>

          {/* Fuel Type */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Fuel Type *
            </Text>
            <View style={styles.radioGroup}>
              {FUEL_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={fuelType === type.value ? 'primary' : 'outline'}
                  onPress={() => setFuelType(type.value)}
                  style={styles.radioButton}
                  size="sm"
                >
                  {type.label}
                </Button>
              ))}
            </View>
          </View>

          {/* Seats & Doors */}
          <View style={styles.row}>
            <Input
              label="Seats"
              value={seats}
              onChangeText={setSeats}
              placeholder="5"
              keyboardType="numeric"
              maxLength={1}
              required
              containerStyle={styles.smallInput}
            />
            <Input
              label="Doors"
              value={doors}
              onChangeText={setDoors}
              placeholder="4"
              keyboardType="numeric"
              maxLength={1}
              required
              containerStyle={styles.smallInput}
            />
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
        <Button
          onPress={handleContinue}
          disabled={!year || !make || !model || !vin || !licensePlate || !color || !odometer}
          fullWidth
        >
          Continue to Photos
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
  form: {
    gap: spacing['4'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  smallInput: {
    flex: 0.3,
  },
  mediumInput: {
    flex: 1,
  },
  largeInput: {
    flex: 0.7,
  },
  inputGroup: {
    marginBottom: spacing['4'],
  },
  label: {
    marginBottom: spacing['2'],
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
  radioButton: {
    minWidth: 100,
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
