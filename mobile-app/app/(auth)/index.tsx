/**
 * Welcome Screen
 * Initial screen with hero and CTAs
 * Will be fully implemented in Day 3
 */

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Carsharing SV</Text>
        <Text style={styles.subtitle}>
          Rent vehicles from local hosts or share yours with verified guests
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/(auth)/register" style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Link>

        <Link href="/(auth)/login" style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});
