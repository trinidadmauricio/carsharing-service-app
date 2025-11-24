/**
 * Register Layout
 * Stack for registration flow screens
 */

import { Stack } from 'expo-router';

export default function RegisterLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Account Type' }} />
      <Stack.Screen name="form" options={{ title: 'Registration' }} />
      <Stack.Screen name="phone-verify" options={{ title: 'Verify Phone' }} />
    </Stack>
  );
}
