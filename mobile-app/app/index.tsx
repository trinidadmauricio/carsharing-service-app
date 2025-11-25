/**
 * App Entry Point
 * Redirects to appropriate screen based on auth state
 */

import React from 'react';

import { Redirect } from 'expo-router';
import { apiClient } from '@/services/apiClient';

export default function Index(): React.JSX.Element {
  // Check if user is authenticated
  const isAuthenticated = apiClient.isAuthenticated();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
