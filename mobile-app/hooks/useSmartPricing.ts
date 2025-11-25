/**
 * useSmartPricing Hook
 * React Query hooks for smart pricing calculations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { svc } from '../services';
import type {
  PricingFactors,
  SmartPriceResult,
  PricingCalculatorInput,
  MarketPriceRange,
  DynamicPricingSuggestion,
} from '../types/pricing';
import type { VehicleType } from '../types/vehicle';

/**
 * Query keys for pricing
 */
export const pricingKeys = {
  all: ['pricing'] as const,
  smartPrice: (factors: PricingFactors) => ['pricing', 'smart', factors] as const,
  marketRange: (vehicleType: VehicleType, city: string, state: string) =>
    ['pricing', 'market', vehicleType, city, state] as const,
  quickEstimate: (input: PricingCalculatorInput) => ['pricing', 'quick', input] as const,
  history: (vehicleId: string, days?: number) =>
    ['pricing', 'history', vehicleId, days] as const,
  suggestion: (vehicleId: string) => ['pricing', 'suggestion', vehicleId] as const,
  earnings: (dailyRate: number, protectionPlanId: string, utilizationRate?: number) =>
    ['pricing', 'earnings', dailyRate, protectionPlanId, utilizationRate] as const,
};

/**
 * Hook to calculate smart price
 */
export function useSmartPrice(
  factors: PricingFactors | null,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: factors ? pricingKeys.smartPrice(factors) : ['pricing', 'smart', 'disabled'],
    queryFn: async () => {
      if (!factors) throw new Error('Pricing factors are required');
      return await svc.pricing.calculateSmartPrice(factors);
    },
    enabled: options?.enabled !== false && factors !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get market price range
 */
export function useMarketPriceRange(
  vehicleType: VehicleType | null,
  city: string | null,
  state: string | null,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey:
      vehicleType && city && state
        ? pricingKeys.marketRange(vehicleType, city, state)
        : ['pricing', 'market', 'disabled'],
    queryFn: async () => {
      if (!vehicleType || !city || !state) {
        throw new Error('Vehicle type, city, and state are required');
      }
      return await svc.pricing.getMarketPriceRange(vehicleType, city, state);
    },
    enabled: options?.enabled !== false && !!vehicleType && !!city && !!state,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get quick price estimate
 */
export function useQuickEstimate(
  input: PricingCalculatorInput | null,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: input ? pricingKeys.quickEstimate(input) : ['pricing', 'quick', 'disabled'],
    queryFn: async () => {
      if (!input) throw new Error('Input is required');
      return await svc.pricing.getQuickEstimate(input);
    },
    enabled: options?.enabled !== false && input !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get pricing history
 */
export function usePricingHistory(
  vehicleId: string | null,
  days: number = 30,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: vehicleId
      ? pricingKeys.history(vehicleId, days)
      : ['pricing', 'history', 'disabled'],
    queryFn: async () => {
      if (!vehicleId) throw new Error('Vehicle ID is required');
      return await svc.pricing.getPricingHistory(vehicleId, days);
    },
    enabled: options?.enabled !== false && !!vehicleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get dynamic pricing suggestion
 */
export function useDynamicSuggestion(
  vehicleId: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: vehicleId
      ? pricingKeys.suggestion(vehicleId)
      : ['pricing', 'suggestion', 'disabled'],
    queryFn: async () => {
      if (!vehicleId) throw new Error('Vehicle ID is required');
      return await svc.pricing.getDynamicSuggestion(vehicleId);
    },
    enabled: options?.enabled !== false && !!vehicleId,
    refetchInterval: options?.refetchInterval, // Can be used for real-time updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to calculate earnings
 */
export function useEarningsCalculator(
  dailyRate: number | null,
  protectionPlanId: string | null,
  utilizationRate: number = 0.5,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey:
      dailyRate !== null && protectionPlanId
        ? pricingKeys.earnings(dailyRate, protectionPlanId, utilizationRate)
        : ['pricing', 'earnings', 'disabled'],
    queryFn: async () => {
      if (dailyRate === null || !protectionPlanId) {
        throw new Error('Daily rate and protection plan ID are required');
      }
      return await svc.pricing.calculateEarnings(dailyRate, protectionPlanId, utilizationRate);
    },
    enabled: options?.enabled !== false && dailyRate !== null && !!protectionPlanId,
    staleTime: 1 * 60 * 1000, // 1 minute (quick recalculation)
  });
}

/**
 * Mutation to update vehicle pricing
 * (This would typically trigger recalculation of smart price)
 */
export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehicleId,
      dailyRate,
      weeklyDiscount,
      monthlyDiscount,
    }: {
      vehicleId: string;
      dailyRate: number;
      weeklyDiscount?: number;
      monthlyDiscount?: number;
    }) => {
      // This would call an API to update pricing
      // For now, we just return the input
      return { vehicleId, dailyRate, weeklyDiscount, monthlyDiscount };
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', data.vehicleId] });
    },
  });
}

/**
 * Combined hook for complete pricing flow
 * Useful for the pricing screen where you need multiple pricing insights
 */
export function usePricingFlow(
  vehicleId: string | null,
  factors: PricingFactors | null
) {
  const smartPrice = useSmartPrice(factors, { enabled: !!factors });

  const marketRange = useMarketPriceRange(
    factors?.vehicleType ?? null,
    factors?.location.city ?? null,
    factors?.location.state ?? null,
    { enabled: !!factors }
  );

  const suggestion = useDynamicSuggestion(vehicleId, { enabled: !!vehicleId });

  const history = usePricingHistory(vehicleId, 30, { enabled: !!vehicleId });

  return {
    smartPrice,
    marketRange,
    suggestion,
    history,
    isLoading:
      smartPrice.isLoading || marketRange.isLoading || suggestion.isLoading || history.isLoading,
    isError: smartPrice.isError || marketRange.isError || suggestion.isError || history.isError,
  };
}
