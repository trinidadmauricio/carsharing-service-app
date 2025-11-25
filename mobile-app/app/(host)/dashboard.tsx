/**
 * Host Dashboard Screen
 * Main dashboard for hosts to manage their vehicles and bookings
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from '../../components/atoms';
import { palette, spacing } from '@/theme';
import type { HostDashboardStats, VehicleListing } from '../../types';

export default function HostDashboardScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Mock data - in production this would come from API
  const [stats] = useState<HostDashboardStats>({
    totalEarnings: 2850.0,
    thisMonthEarnings: 485.0,
    lastMonthEarnings: 620.0,
    pendingPayouts: 245.0,
    totalTrips: 12,
    activeTrips: 1,
    upcomingTrips: 2,
    completedTrips: 9,
    totalVehicles: 2,
    activeVehicles: 2,
    inactiveVehicles: 0,
    pendingApproval: 0,
    averageRating: 4.8,
    responseRate: 98,
    acceptanceRate: 92,
    pendingRequests: 3,
  });

  const [hasVehicles] = useState(false); // Toggle for demo

  const handleListVehicle = (): void => {
    router.push('/(host)/vehicle/info');
  };

  const handleViewOnboarding = (): void => {
    router.push('/(host)/onboarding');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEarningsChange = (): string => {
    if (stats.lastMonthEarnings === 0) return '+100%';
    const change =
      ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100;
    return change >= 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  const isEarningsUp = (): boolean => {
    return stats.thisMonthEarnings >= stats.lastMonthEarnings;
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

        {/* Earnings Summary Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <View>
              <Text variant="labelMedium" color="secondary">
                This Month
              </Text>
              <Text variant="h1" style={styles.earningsAmount}>
                {formatCurrency(stats.thisMonthEarnings)}
              </Text>
            </View>
            <View
              style={[
                styles.changeBadge,
                {
                  backgroundColor: isEarningsUp()
                    ? palette.success[50]
                    : palette.error[50],
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: isEarningsUp() ? palette.success[700] : palette.error[700],
                }}
              >
                {getEarningsChange()}
              </Text>
            </View>
          </View>

          <View style={styles.earningsDetails}>
            <View style={styles.earningsDetailItem}>
              <Text variant="caption" color="secondary">
                Last Month
              </Text>
              <Text variant="labelLarge">
                {formatCurrency(stats.lastMonthEarnings)}
              </Text>
            </View>
            <View style={styles.earningsDetailDivider} />
            <View style={styles.earningsDetailItem}>
              <Text variant="caption" color="secondary">
                Pending Payout
              </Text>
              <Text variant="labelLarge" style={{ color: palette.warning[600] }}>
                {formatCurrency(stats.pendingPayouts)}
              </Text>
            </View>
            <View style={styles.earningsDetailDivider} />
            <View style={styles.earningsDetailItem}>
              <Text variant="caption" color="secondary">
                Total Earned
              </Text>
              <Text variant="labelLarge">
                {formatCurrency(stats.totalEarnings)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text variant="h2" style={styles.statValue}>
              {stats.activeVehicles}
            </Text>
            <Text variant="caption" color="secondary">
              Active Vehicles
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text variant="h2" style={styles.statValue}>
              {stats.activeTrips}
            </Text>
            <Text variant="caption" color="secondary">
              Active Trips
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text variant="h2" style={styles.statValue}>
              {stats.averageRating.toFixed(1)} ⭐
            </Text>
            <Text variant="caption" color="secondary">
              Rating
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

        {/* Pending Requests */}
        {stats.pendingRequests > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="h3">Pending Requests</Text>
              <View style={styles.badge}>
                <Text variant="labelSmall" style={styles.badgeText}>
                  {stats.pendingRequests}
                </Text>
              </View>
            </View>

            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text variant="labelLarge">2024 Honda Civic</Text>
                  <Text variant="caption" color="secondary">
                    Apr 15 - Apr 18 (3 days)
                  </Text>
                </View>
                <Text variant="h4" style={{ color: palette.primary[500] }}>
                  $135
                </Text>
              </View>
              <View style={styles.requestGuest}>
                <Text variant="bodySmall" color="secondary">
                  Guest: Maria Rodriguez • 4.9 ⭐ • 8 trips
                </Text>
              </View>
              <View style={styles.requestActions}>
                <Button variant="outline" size="sm" style={styles.requestButton}>
                  Decline
                </Button>
                <Button size="sm" style={styles.requestButton}>
                  Accept
                </Button>
              </View>
            </View>

            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View>
                  <Text variant="labelLarge">2023 Toyota RAV4</Text>
                  <Text variant="caption" color="secondary">
                    Apr 20 - Apr 27 (7 days)
                  </Text>
                </View>
                <Text variant="h4" style={{ color: palette.primary[500] }}>
                  $350
                </Text>
              </View>
              <View style={styles.requestGuest}>
                <Text variant="bodySmall" color="secondary">
                  Guest: Carlos Mendez • 4.7 ⭐ • 15 trips
                </Text>
              </View>
              <View style={styles.requestActions}>
                <Button variant="outline" size="sm" style={styles.requestButton}>
                  Decline
                </Button>
                <Button size="sm" style={styles.requestButton}>
                  Accept
                </Button>
              </View>
            </View>

            <Button variant="ghost" style={styles.viewAllButton}>
              View All Requests ({stats.pendingRequests})
            </Button>
          </View>
        )}

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3">My Vehicles</Text>
            <Button variant="ghost" size="sm" onPress={handleListVehicle}>
              + Add Vehicle
            </Button>
          </View>

          {hasVehicles ? (
            <>
              <View style={styles.vehicleCard}>
                <View style={styles.vehicleImage}>
                  <Text style={styles.vehiclePlaceholder}>🚗</Text>
                </View>
                <View style={styles.vehicleInfo}>
                  <Text variant="labelLarge">2024 Honda Civic</Text>
                  <Text variant="caption" color="secondary" style={styles.vehicleDetail}>
                    Active • $45/day • San Salvador
                  </Text>
                  <View style={styles.vehicleStats}>
                    <Text variant="caption" style={styles.vehicleStat}>
                      5 trips • 4.9 ⭐
                    </Text>
                  </View>
                </View>
                <Pressable style={styles.vehicleAction}>
                  <Text style={styles.actionArrow}>›</Text>
                </Pressable>
              </View>

              <View style={styles.vehicleCard}>
                <View style={styles.vehicleImage}>
                  <Text style={styles.vehiclePlaceholder}>🚙</Text>
                </View>
                <View style={styles.vehicleInfo}>
                  <Text variant="labelLarge">2023 Toyota RAV4</Text>
                  <Text variant="caption" color="secondary" style={styles.vehicleDetail}>
                    Active • $50/day • San Salvador
                  </Text>
                  <View style={styles.vehicleStats}>
                    <Text variant="caption" style={styles.vehicleStat}>
                      7 trips • 4.8 ⭐
                    </Text>
                  </View>
                </View>
                <Pressable style={styles.vehicleAction}>
                  <Text style={styles.actionArrow}>›</Text>
                </Pressable>
              </View>
            </>
          ) : (
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
          )}
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
  // Earnings Card
  earningsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: spacing['5'],
    marginBottom: spacing['5'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['4'],
  },
  earningsAmount: {
    color: palette.primary[600],
    marginTop: spacing['1'],
  },
  changeBadge: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 20,
  },
  earningsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing['4'],
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
  },
  earningsDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsDetailDivider: {
    width: 1,
    backgroundColor: palette.neutral[200],
    marginHorizontal: spacing['2'],
  },
  // Badge
  badge: {
    backgroundColor: palette.primary[500],
    borderRadius: 12,
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  // Request Cards
  requestCard: {
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2'],
  },
  requestGuest: {
    marginBottom: spacing['3'],
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  requestButton: {
    flex: 1,
  },
  viewAllButton: {
    marginTop: spacing['2'],
  },
  // Vehicle Cards
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  vehicleImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing['3'],
  },
  vehiclePlaceholder: {
    fontSize: 32,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleDetail: {
    marginTop: spacing['1'],
  },
  vehicleStats: {
    marginTop: spacing['2'],
  },
  vehicleStat: {
    color: palette.neutral[600],
  },
  vehicleAction: {
    justifyContent: 'center',
    paddingLeft: spacing['3'],
  },
});
