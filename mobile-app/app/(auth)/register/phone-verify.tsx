/**
 * Phone Verification Screen
 * Placeholder - Will be fully implemented in Day 4
 */

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function PhoneVerifyScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone</Text>
      <Text style={styles.subtitle}>
        Phone verification - Coming in Day 4
      </Text>

      <Link href="/(auth)/register/form" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
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
