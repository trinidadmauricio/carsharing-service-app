/**
 * Trip Detail Page (Placeholder)
 * Will be implemented in Sprint 5: Trip Management
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { useThemeColors } from '@/theme';
import { spacing } from '@/theme/spacing';

export default function TripDetailScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Trip Details',
        }}
      />
      <View style={styles.content}>
        <Text variant="h2" style={{ color: colors.text.primary, textAlign: 'center' }}>
          Trip Details
        </Text>
        <Text
          variant="body1"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: spacing['2'],
          }}
        >
          Booking ID: {params.id}
        </Text>
        <Text
          variant="caption"
          style={{
            color: colors.text.tertiary,
            textAlign: 'center',
            marginTop: spacing['4'],
          }}
        >
          This screen will be implemented in Sprint 5: Trip Management
        </Text>
        <Button
          variant="primary"
          size="md"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: spacing['6'] }}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
  },
});
