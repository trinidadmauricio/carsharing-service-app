/**
 * Forgot Password Screen
 * Placeholder - Will be fully implemented in Day 5
 */

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ForgotPasswordScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Password recovery - Coming in Day 5
      </Text>

      <Link href="/(auth)/login" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to Login</Text>
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
