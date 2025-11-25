/**
 * Tabs Layout
 * Main app navigation after authentication
 * Shows Browse, Bookings, and Profile tabs
 */

import React from 'react';

import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🚗</Text>,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
