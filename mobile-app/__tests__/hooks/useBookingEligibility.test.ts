/**
 * useBookingEligibility Hook Tests
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useBookingEligibility, useUserRiskScore } from '@/hooks/useBookingEligibility';
import { useAuth } from '@/hooks/useAuth';
import { checkBookingEligibility } from '@/utils/riskScoring';
import { createMockGuestUser } from '../helpers/testUtils';

// Mock dependencies
jest.mock('@/hooks/useAuth');
jest.mock('@/utils/riskScoring');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockCheckBookingEligibility = checkBookingEligibility as jest.MockedFunction<
  typeof checkBookingEligibility
>;

describe('useBookingEligibility', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useBookingEligibility', () => {
    it('should be disabled when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.eligibility).toBeUndefined();
    });

    it('should be disabled when vehicleId is not provided', () => {
      const mockUser = createMockGuestUser();

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: '',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.eligibility).toBeUndefined();
    });

    it('should calculate eligibility correctly for eligible user', async () => {
      const mockUser = createMockGuestUser({
        id: 'user-1',
        createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 12 months ago
        dateOfBirth: '1990-01-01', // 34 years old
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 10,
        averageRating: 4.8,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const mockEligibility = {
        eligible: true,
        riskScore: {
          score: 85,
          level: 'low' as const,
          factors: [],
          canInstantBook: true,
          requiresManualApproval: false,
          restrictions: [],
          calculatedAt: new Date().toISOString(),
        },
        canInstantBook: true,
        requiresApproval: false,
        restrictions: [],
      };

      mockCheckBookingEligibility.mockReturnValue(mockEligibility);

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.eligibility).toBeDefined();
      expect(result.current.canBook).toBe(true);
      expect(result.current.canInstantBook).toBe(true);
      expect(result.current.requiresApproval).toBe(false);
    });

    it('should calculate account age in months correctly', async () => {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      const mockUser = createMockGuestUser({
        createdAt: sixMonthsAgo.toISOString(),
        dateOfBirth: '1995-01-01',
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 5,
        averageRating: 4.5,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      mockCheckBookingEligibility.mockReturnValue({
        eligible: true,
        riskScore: {
          score: 70,
          level: 'medium' as const,
          factors: [],
          canInstantBook: true,
          requiresManualApproval: false,
          restrictions: [],
          calculatedAt: new Date().toISOString(),
        },
        canInstantBook: true,
        requiresApproval: false,
        restrictions: [],
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockCheckBookingEligibility).toHaveBeenCalled();
      const callArgs = mockCheckBookingEligibility.mock.calls[0][0];
      expect(callArgs.accountAgeMonths).toBeCloseTo(6, 0);
    });

    it('should calculate driver age from dateOfBirth correctly', async () => {
      const birthYear = 1995;
      const currentYear = new Date().getFullYear();
      const expectedAge = currentYear - birthYear;

      const mockUser = createMockGuestUser({
        dateOfBirth: `${birthYear}-01-01`,
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 5,
        averageRating: 4.5,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      mockCheckBookingEligibility.mockReturnValue({
        eligible: true,
        riskScore: {
          score: 70,
          level: 'medium' as const,
          factors: [],
          canInstantBook: true,
          requiresManualApproval: false,
          restrictions: [],
          calculatedAt: new Date().toISOString(),
        },
        canInstantBook: true,
        requiresApproval: false,
        restrictions: [],
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockCheckBookingEligibility).toHaveBeenCalled();
      const callArgs = mockCheckBookingEligibility.mock.calls[0][0];
      expect(callArgs.driverAge).toBe(expectedAge);
    });

    it('should use default age 25 when dateOfBirth is not available', async () => {
      const mockUser = createMockGuestUser({
        dateOfBirth: undefined,
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 5,
        averageRating: 4.5,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      mockCheckBookingEligibility.mockReturnValue({
        eligible: true,
        riskScore: {
          score: 70,
          level: 'medium' as const,
          factors: [],
          canInstantBook: true,
          requiresManualApproval: false,
          restrictions: [],
          calculatedAt: new Date().toISOString(),
        },
        canInstantBook: true,
        requiresApproval: false,
        restrictions: [],
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockCheckBookingEligibility).toHaveBeenCalled();
      const callArgs = mockCheckBookingEligibility.mock.calls[0][0];
      expect(callArgs.driverAge).toBe(25);
    });

    it('should handle blocked users correctly', async () => {
      const mockUser = createMockGuestUser({
        dateOfBirth: '2005-01-01', // Under 21
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 5,
        averageRating: 4.5,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const mockEligibility = {
        eligible: false,
        riskScore: {
          score: 30,
          level: 'high' as const,
          factors: [],
          canInstantBook: false,
          requiresManualApproval: true,
          restrictions: [],
          calculatedAt: new Date().toISOString(),
        },
        canInstantBook: false,
        requiresApproval: false,
        restrictions: [],
        blockedReason: 'You must be at least 21 years old to rent a vehicle',
      };

      mockCheckBookingEligibility.mockReturnValue(mockEligibility);

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canBook).toBe(false);
      expect(result.current.blockedReason).toBe('You must be at least 21 years old to rent a vehicle');
    });

    it('should handle error state', async () => {
      const mockUser = createMockGuestUser();

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      mockCheckBookingEligibility.mockImplementation(() => {
        throw new Error('Calculation failed');
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should respect enabled option', () => {
      const mockUser = createMockGuestUser();

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const { result } = renderHook(
        () =>
          useBookingEligibility({
            vehicleId: 'vehicle-1',
            vehicleInstantBook: true,
            enabled: false,
          }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.eligibility).toBeUndefined();
    });
  });

  describe('useUserRiskScore', () => {
    it('should calculate risk score for authenticated user', async () => {
      const mockUser = createMockGuestUser({
        idVerified: true,
        faceMatchVerified: true,
        totalTrips: 10,
        averageRating: 4.8,
        claims: [],
      });

      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const { result } = renderHook(() => useUserRiskScore(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.score).toBeDefined();
      expect(result.current.data?.level).toBeDefined();
    });

    it('should be disabled when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshSession: jest.fn(),
        updateUser: jest.fn(),
      });

      const { result } = renderHook(() => useUserRiskScore(), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});

