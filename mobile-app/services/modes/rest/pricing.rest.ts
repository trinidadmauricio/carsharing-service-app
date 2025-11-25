/**
 * Pricing Service - REST Implementation
 * Connects to real pricing API endpoints
 */

import { apiClient } from '../../apiClient';
import type { PricingService } from '../../pricing';
import type {
  PricingFactors,
  SmartPriceResult,
  MarketPriceRange,
  PricingHistory,
  DynamicPricingSuggestion,
  PricingCalculatorInput,
} from '../../../types/pricing';
import type { VehicleType } from '../../../types/vehicle';

/**
 * Calculate smart price
 */
async function calculateSmartPrice(factors: PricingFactors): Promise<SmartPriceResult> {
  const response = await apiClient.post<SmartPriceResult>('/pricing/calculate', factors);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to calculate smart price');
  }

  return response.data;
}

/**
 * Get market price range
 */
async function getMarketPriceRange(
  vehicleType: VehicleType,
  city: string,
  state: string
): Promise<MarketPriceRange> {
  const params = new URLSearchParams({ vehicleType, city, state });
  const response = await apiClient.get<MarketPriceRange>(`/pricing/market-range?${params}`);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch market price range');
  }

  return response.data;
}

/**
 * Get quick estimate
 */
async function getQuickEstimate(
  input: PricingCalculatorInput
): Promise<{ estimatedRate: number; range: { min: number; max: number } }> {
  const response = await apiClient.post<{
    estimatedRate: number;
    range: { min: number; max: number };
  }>('/pricing/quick-estimate', input);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get quick estimate');
  }

  return response.data;
}

/**
 * Get pricing history
 */
async function getPricingHistory(
  vehicleId: string,
  days: number = 30
): Promise<PricingHistory[]> {
  const response = await apiClient.get<PricingHistory[]>(
    `/pricing/history/${vehicleId}?days=${days}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch pricing history');
  }

  return response.data;
}

/**
 * Get dynamic pricing suggestion
 */
async function getDynamicSuggestion(
  vehicleId: string
): Promise<DynamicPricingSuggestion | null> {
  const response = await apiClient.get<DynamicPricingSuggestion | null>(
    `/pricing/suggestion/${vehicleId}`
  );

  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch pricing suggestion');
  }

  return response.data ?? null;
}

/**
 * Calculate earnings estimate
 */
async function calculateEarnings(
  dailyRate: number,
  protectionPlanId: string,
  utilizationRate: number = 0.5
): Promise<{
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  platformFee: number;
}> {
  const response = await apiClient.post<{
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    platformFee: number;
  }>('/pricing/earnings', {
    dailyRate,
    protectionPlanId,
    utilizationRate,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to calculate earnings');
  }

  return response.data;
}

/**
 * Export REST implementation
 */
export const pricingRest: PricingService = {
  calculateSmartPrice,
  getMarketPriceRange,
  getQuickEstimate,
  getPricingHistory,
  getDynamicSuggestion,
  calculateEarnings,
};
