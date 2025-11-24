/**
 * Login Screen
 * Placeholder - Will be fully implemented in Day 5
 */

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Login screen - Coming in Day 5</Text>

      <Link href="/(auth)" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to Welcome</Text>
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
    color: '#6b7280',
    marginBottom: 24,
  },
  backLink: {
    marginTop: 24,
  },
  backLinkText: {
    fontSize: 16,
    color: '#667eea',
  },
});
