/**
 * Bookings Screen
 * User's booking history and active trips
 * Placeholder - Will be implemented in Sprint 3
 */

import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

export default function BookingsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>Booking management - Coming in Sprint 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
