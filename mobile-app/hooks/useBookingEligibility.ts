/**
 * useBookingEligibility Hook
 * Check if guest is eligible to book a vehicle
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkBookingEligibility } from '@/utils/riskScoring';
import { useAuth } from './useAuth';
import type {
  BookingEligibility,
  RiskCalculationInput,
} from '@/types/riskScore';

interface UseBookingEligibilityOptions {
  vehicleId: string;
  vehicleInstantBook: boolean;
  enabled?: boolean;
}

interface UseBookingEligibilityReturn {
  eligibility: BookingEligibility | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  canBook: boolean;
  canInstantBook: boolean;
  requiresApproval: boolean;
  blockedReason?: string;
}

/**
 * Hook to check booking eligibility for current user
 */
export function useBookingEligibility(
  options: UseBookingEligibilityOptions
): UseBookingEligibilityReturn {
  const { vehicleId, vehicleInstantBook, enabled = true } = options;
  const { user } = useAuth();

  // Query to calculate eligibility
  const query = useQuery({
    queryKey: ['booking-eligibility', vehicleId, user?.id],
    queryFn: async (): Promise<BookingEligibility> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate account age in months
      const createdAt = new Date(user.createdAt);
      const now = new Date();
      const accountAgeMonths =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);

      // Calculate driver age from date of birth (if available)
      let driverAge = 25; // Default to safe age
      if (user.role === 'guest' && 'dateOfBirth' in user) {
        const dob = new Date((user as any).dateOfBirth);
        driverAge = now.getFullYear() - dob.getFullYear();
      }

      // Prepare risk calculation input
      const riskInput: RiskCalculationInput = {
        userId: user.id,
        idVerified: (user as any).idVerified || false,
        faceMatchVerified: user.role === 'guest' ? (user as any).faceMatchVerified || false : false,
        completedTrips: user.role === 'guest' ? (user as any).totalTrips || 0 : 0,
        averageRating: (user as any).averageRating || 0,
        atFaultClaims:
          user.role === 'guest'
            ? (user as any).claims?.filter((c: any) => c.atFault).length || 0
            : 0,
        accountAgeMonths,
        driverAge,
      };

      // Calculate eligibility
      return checkBookingEligibility(riskInput, vehicleInstantBook);
    },
    enabled: enabled && !!user && !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Derived values
  const canBook = query.data?.eligible ?? false;
  const canInstantBook = query.data?.canInstantBook ?? false;
  const requiresApproval = query.data?.requiresApproval ?? false;
  const blockedReason = query.data?.blockedReason;

  return {
    eligibility: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    canBook,
    canInstantBook,
    requiresApproval,
    blockedReason,
  };
}

/**
 * Hook to get risk score for current user (without vehicle context)
 */
export function useUserRiskScore() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-risk-score', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const createdAt = new Date(user.createdAt);
      const now = new Date();
      const accountAgeMonths =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);

      let driverAge = 25;
      if (user.role === 'guest' && 'dateOfBirth' in user) {
        const dob = new Date((user as any).dateOfBirth);
        driverAge = now.getFullYear() - dob.getFullYear();
      }

      const riskInput: RiskCalculationInput = {
        userId: user.id,
        idVerified: (user as any).idVerified || false,
        faceMatchVerified: user.role === 'guest' ? (user as any).faceMatchVerified || false : false,
        completedTrips: user.role === 'guest' ? (user as any).totalTrips || 0 : 0,
        averageRating: (user as any).averageRating || 0,
        atFaultClaims:
          user.role === 'guest'
            ? (user as any).claims?.filter((c: any) => c.atFault).length || 0
            : 0,
        accountAgeMonths,
        driverAge,
      };

      // Import here to avoid circular dependency
      const { calculateGuestRiskScore } = await import('@/utils/riskScoring');
      return calculateGuestRiskScore(riskInput);
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
