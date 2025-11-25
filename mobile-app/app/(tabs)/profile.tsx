/**
 * Profile Screen
 * User profile and settings with host mode access
 */

import React from 'react';

import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from '@/components/atoms';
import { palette, spacing } from '@/theme';
import { svc } from '@/services';

export default function ProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const handleLogout = async (): Promise<void> => {
    await svc.auth.logout();
    router.replace('/(auth)');
  };

  const handleHostDashboard = (): void => {
    router.push('/(host)/dashboard');
  };

  const handleBecomeHost = (): void => {
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
          <Text variant="h2">Profile</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Manage your account and hosting
          </Text>
        </View>

        {/* Host Mode Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Hosting
          </Text>

          {/* Switch to Host Dashboard */}
          <Pressable style={styles.hostCard} onPress={handleHostDashboard}>
            <View style={styles.hostIcon}>
              <Text style={styles.hostEmoji}>🏠</Text>
            </View>
            <View style={styles.hostContent}>
              <Text variant="labelLarge">Switch to Hosting</Text>
              <Text variant="caption" color="secondary">
                Manage your vehicles and bookings
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          {/* Become a Host */}
          <Pressable style={styles.becomeHostCard} onPress={handleBecomeHost}>
            <View style={styles.becomeHostContent}>
              <Text variant="labelLarge" style={styles.becomeHostTitle}>
                💰 Earn money as a host
              </Text>
              <Text variant="caption" color="secondary" style={styles.becomeHostText}>
                List your vehicle and start earning. Complete onboarding in minutes.
              </Text>
            </View>
            <Button variant="primary" size="sm" onPress={handleBecomeHost}>
              Get Started
            </Button>
          </Pressable>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Account
          </Text>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Personal Information</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Payment Methods</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Security</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Settings
          </Text>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Notifications</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Privacy</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text variant="labelLarge">Help & Support</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button variant="outline" onPress={handleLogout} fullWidth>
            Logout
          </Button>
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
  section: {
    marginBottom: spacing['6'],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  hostIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing['3'],
  },
  hostEmoji: {
    fontSize: 24,
  },
  hostContent: {
    flex: 1,
  },
  arrow: {
    fontSize: 32,
    color: palette.neutral[300],
    fontWeight: '300',
  },
  becomeHostCard: {
    backgroundColor: palette.primary[50],
    padding: spacing['4'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.primary[200],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  becomeHostContent: {
    flex: 1,
  },
  becomeHostTitle: {
    marginBottom: spacing['1'],
    color: palette.primary[700],
  },
  becomeHostText: {
    lineHeight: 18,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderRadius: 12,
    marginBottom: spacing['2'],
    borderWidth: 1,
    borderColor: palette.neutral[200],
  },
  logoutSection: {
    marginTop: spacing['4'],
  },
});
