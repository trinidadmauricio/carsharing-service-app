/**
 * Account Type Selection Screen
 * Placeholder - Will be fully implemented in Day 3
 */

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function AccountTypeScreen(): JSX.Element {
  const handleSelectType = (type: 'guest' | 'host'): void => {
    // Navigate to registration form with selected type
    router.push({
      pathname: '/(auth)/register/form',
      params: { type },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join Carsharing SV</Text>
        <Text style={styles.subtitle}>How do you want to use the app?</Text>
      </View>

      <View style={styles.options}>
        <Pressable
          style={styles.optionCard}
          onPress={() => handleSelectType('guest')}
          accessibilityRole="button"
          accessibilityLabel="I want to rent cars"
        >
          <Text style={styles.optionEmoji}>🚗</Text>
          <Text style={styles.optionTitle}>I want to rent</Text>
          <Text style={styles.optionDescription}>
            Find and book vehicles from local hosts
          </Text>
        </Pressable>

        <Pressable
          style={styles.optionCard}
          onPress={() => handleSelectType('host')}
          accessibilityRole="button"
          accessibilityLabel="I want to share my car"
        >
          <Text style={styles.optionEmoji}>🔑</Text>
          <Text style={styles.optionTitle}>I want to share</Text>
          <Text style={styles.optionDescription}>
            List your vehicle and earn extra income
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  options: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
