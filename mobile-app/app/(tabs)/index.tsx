/**
 * Browse Screen (Home)
 * Vehicle listing and search
 * Placeholder - Will be implemented in Sprint 2
 */

import { View, Text, StyleSheet } from 'react-native';

export default function BrowseScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Vehicles</Text>
      <Text style={styles.subtitle}>Vehicle search - Coming in Sprint 2</Text>
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
