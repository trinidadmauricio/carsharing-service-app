/**
 * Host Dashboard Screen
 * Main dashboard for hosts to manage their vehicles and bookings
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from '../../components/atoms';
import { palette, spacing } from '@/theme';

export default function HostDashboardScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const handleListVehicle = (): void => {
    router.push('/(host)/vehicle/info');
  };

  const handleViewOnboarding = (): void => {
    router.push('/(host)/onboarding');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing['4'] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Host Dashboard</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Manage your vehicles and earnings
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text variant="h1" style={styles.statValue}>
              $0
            </Text>
            <Text variant="caption" color="secondary">
              Total Earnings
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text variant="h1" style={styles.statValue}>
              0
            </Text>
            <Text variant="caption" color="secondary">
              Active Vehicles
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text variant="h1" style={styles.statValue}>
              0
            </Text>
            <Text variant="caption" color="secondary">
              Total Trips
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <Pressable style={styles.actionCard} onPress={handleListVehicle}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🚗</Text>
            </View>
            <View style={styles.actionContent}>
              <Text variant="labelLarge">List a New Vehicle</Text>
              <Text variant="caption" color="secondary">
                Add your vehicle and start earning
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={handleViewOnboarding}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📋</Text>
            </View>
            <View style={styles.actionContent}>
              <Text variant="labelLarge">Complete Host Onboarding</Text>
              <Text variant="caption" color="secondary">
                Get verified and set up protection
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
        </View>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">My Vehicles</Text>
            <Button variant="ghost" size="sm" onPress={handleListVehicle}>
              + Add Vehicle
            </Button>
          </View>

          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚙</Text>
            <Text variant="h4" style={styles.emptyTitle}>
              No vehicles listed yet
            </Text>
            <Text variant="bodyMedium" color="secondary" style={styles.emptyText}>
              List your first vehicle to start earning money
            </Text>
            <Button onPress={handleListVehicle} style={styles.emptyButton}>
              List Your First Vehicle
            </Button>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text variant="labelLarge" style={styles.infoTitle}>
            💡 Getting Started as a Host
          </Text>
          <Text variant="caption" color="secondary" style={styles.infoText}>
            1. Complete host onboarding{'\n'}
            2. Add vehicle information{'\n'}
            3. Upload 8+ quality photos{'\n'}
            4. Set your location{'\n'}
            5. Configure pricing{'\n'}
            6. Start earning!
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: spacing['10'],
  },
  header: {
    marginBottom: spacing['5'],
  },
  subtitle: {
    marginTop: spacing['2'],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing['3'],
    marginBottom: spacing['6'],
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  statValue: {
    color: palette.primary[500],
    marginBottom: spacing['1'],
  },
  section: {
    marginBottom: spacing['6'],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing['3'],
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionArrow: {
    fontSize: 32,
    color: palette.neutral[300],
    fontWeight: '300',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: spacing['6'],
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing['3'],
  },
  emptyTitle: {
    marginBottom: spacing['2'],
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing['4'],
  },
  emptyButton: {
    minWidth: 200,
  },
  infoCard: {
    backgroundColor: palette.info[50],
    padding: spacing['4'],
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
  },
});
