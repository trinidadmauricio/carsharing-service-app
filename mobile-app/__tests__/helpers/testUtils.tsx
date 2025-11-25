/**
 * Test Utilities
 * Helper functions and providers for testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from '@/types/user';
import type { Vehicle } from '@/types/vehicle';

/**
 * Create a test QueryClient with default options
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Renamed from cacheTime in TanStack Query v5
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Render component with QueryClientProvider wrapper
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof render> {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Create a mock user for testing
 */
export function createMockUser(overrides?: Partial<User>): User {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

  return {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'guest',
    createdAt: sixMonthsAgo.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  } as User;
}

/**
 * Create a mock guest user with additional properties
 */
export function createMockGuestUser(overrides?: Partial<User>): User {
  const baseUser = createMockUser({ role: 'guest' });
  return {
    ...baseUser,
    idVerified: true,
    faceMatchVerified: true,
    totalTrips: 5,
    averageRating: 4.8,
    claims: [],
    dateOfBirth: '1995-01-01',
    ...overrides,
  } as User;
}

/**
 * Create a mock vehicle for testing
 */
export function createMockVehicle(overrides?: Partial<Vehicle>): Vehicle {
  return {
    id: 'vehicle-1',
    hostId: 'host-1',
    title: 'Test Vehicle',
    description: 'A test vehicle',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    licensePlate: 'ABC-123',
    location: {
      latitude: 13.6929,
      longitude: -89.2182,
      address: 'San Salvador, El Salvador',
      city: 'San Salvador',
    },
    pricing: {
      dailyRate: 50,
      weeklyDiscount: 10,
      monthlyDiscount: 20,
    },
    features: [],
    photos: [],
    instantBook: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Vehicle;
}

