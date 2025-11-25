/**
 * Pricing Service Interface
 * Smart pricing calculations and market insights
 */

import type {
  PricingFactors,
  SmartPriceResult,
  MarketPriceRange,
  PricingHistory,
  DynamicPricingSuggestion,
  PricingCalculatorInput,
} from '../types/pricing';
import type { VehicleType } from '../types/vehicle';

/**
 * Pricing Service
 * Handles smart pricing calculations, market analysis, and pricing suggestions
 */
export interface PricingService {
  /**
   * Calculate smart price for a vehicle
   * Returns recommended pricing with market insights
   */
  calculateSmartPrice(factors: PricingFactors): Promise<SmartPriceResult>;

  /**
   * Get market price range for vehicle type in location
   */
  getMarketPriceRange(
    vehicleType: VehicleType,
    city: string,
    state: string
  ): Promise<MarketPriceRange>;

  /**
   * Get quick price estimate (simplified calculation)
   */
  getQuickEstimate(input: PricingCalculatorInput): Promise<{
    estimatedRate: number;
    range: { min: number; max: number };
  }>;

  /**
   * Get pricing history for a vehicle
   */
  getPricingHistory(vehicleId: string, days?: number): Promise<PricingHistory[]>;

  /**
   * Get dynamic pricing suggestions for vehicle
   */
  getDynamicSuggestion(vehicleId: string): Promise<DynamicPricingSuggestion | null>;

  /**
   * Calculate earnings estimate based on rate and protection plan
   */
  calculateEarnings(
    dailyRate: number,
    protectionPlanId: string,
    utilizationRate?: number
  ): Promise<{
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    platformFee: number;
  }>;
}
