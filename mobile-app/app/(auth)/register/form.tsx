/**
 * Registration Form Screen
 * Placeholder - Will be fully implemented in Day 4
 */

import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

export default function RegistrationFormScreen(): JSX.Element {
  const { type } = useLocalSearchParams<{ type: 'guest' | 'host' }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Registering as: {type === 'host' ? 'Host' : 'Guest'}
      </Text>
      <Text style={styles.placeholder}>
        Registration form - Coming in Day 4
      </Text>

      <Link href="/(auth)/register" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to Account Type</Text>
      </Link>
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
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#6b7280',
  },
  backLink: {
    marginTop: 24,
  },
  backLinkText: {
    fontSize: 16,
    color: '#667eea',
  },
});
