/**
 * Pricing Types
 * Smart pricing engine types for dynamic vehicle pricing
 */

import type { VehicleType } from './vehicle';

/**
 * Pricing factors that influence the smart price
 */
export interface PricingFactors {
  // Vehicle characteristics
  vehicleType: VehicleType;
  year: number;
  make: string;
  model: string;

  // Location data
  location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };

  // Market data
  marketData?: {
    averageDailyRate: number; // Average rate for similar vehicles in area
    demandLevel: 'low' | 'medium' | 'high'; // Current demand level
    competitorCount: number; // Number of similar vehicles nearby
    seasonalFactor: number; // 0.8-1.5 (winter vs summer, etc.)
  };

  // Vehicle features
  features: string[];
  instantBookEnabled: boolean;

  // Host reputation
  hostRating?: number;
  hostTripsCompleted?: number;
  hostResponseRate?: number;
}

/**
 * Smart price calculation result
 */
export interface SmartPriceResult {
  // Recommended pricing
  recommendedDailyRate: number;
  minRecommended: number;
  maxRecommended: number;

  // Confidence
  confidenceLevel: 'low' | 'medium' | 'high';
  confidenceScore: number; // 0-100

  // Market insights
  marketInsights: {
    competitivePosition: 'below' | 'average' | 'above'; // Compared to market
    estimatedBookingRate: number; // 0-100 percentage
    suggestedWeeklyDiscount: number; // Percentage
    suggestedMonthlyDiscount: number; // Percentage
  };

  // Breakdown (for transparency)
  breakdown: {
    basePrice: number;
    vehicleTypeAdjustment: number;
    locationAdjustment: number;
    demandAdjustment: number;
    featuresAdjustment: number;
    hostReputationAdjustment: number;
  };

  // Earnings estimates (after platform fee)
  earningsEstimate: {
    daily: number;
    weekly: number;
    monthly: number;
    platformFee: number; // Percentage
  };
}

/**
 * Price range for a vehicle type in a market
 */
export interface MarketPriceRange {
  vehicleType: VehicleType;
  city: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  sampleSize: number; // Number of listings analyzed
}

/**
 * Historical pricing data for trends
 */
export interface PricingHistory {
  vehicleId: string;
  date: string;
  dailyRate: number;
  bookingRate: number; // 0-100 percentage
  viewCount: number;
  inquiryCount: number;
  bookingCount: number;
}

/**
 * Dynamic pricing suggestion
 */
export interface DynamicPricingSuggestion {
  vehicleId: string;
  currentRate: number;
  suggestedRate: number;
  changePercentage: number;
  reason: string;
  expectedImpact: {
    bookingRateChange: number; // Percentage points
    earningsChange: number; // Dollar amount per month
  };
  validUntil: string; // ISO date
}

/**
 * Pricing calculator input
 */
export interface PricingCalculatorInput {
  vehicleType: VehicleType;
  year: number;
  make: string;
  model: string;
  city: string;
  state: string;
  features: string[];
  instantBookEnabled: boolean;
}

/**
 * Base prices by vehicle type (starting point for calculations)
 */
export const BASE_PRICES_BY_TYPE: Record<VehicleType, number> = {
  compact: 35,
  sedan: 45,
  suv: 65,
  luxury: 120,
  sports: 150,
  minivan: 75,
  truck: 85,
  convertible: 95,
  electric: 70,
};

/**
 * Default platform fee percentages by protection plan
 */
export const PLATFORM_FEES = {
  basic: 40, // Host keeps 60%
  standard: 25, // Host keeps 75%
  premium: 15, // Host keeps 85%
} as const;

/**
 * Location multipliers for major cities in El Salvador
 */
export const LOCATION_MULTIPLIERS: Record<string, number> = {
  'San Salvador': 1.2, // Capital, highest demand
  'Santa Ana': 1.0, // Second largest city
  'San Miguel': 1.0,
  'Soyapango': 0.95,
  'Santa Tecla': 1.1,
  'Apopa': 0.9,
  'Delgado': 0.95,
  'default': 0.85, // Other locations
};

/**
 * Seasonal factors by month (El Salvador specific)
 */
export const SEASONAL_FACTORS: Record<number, number> = {
  1: 0.9, // January - Post-holidays
  2: 0.85, // February - Low season
  3: 1.0, // March - Spring break starts
  4: 1.1, // April - Holy Week (high demand)
  5: 0.95, // May
  6: 0.9, // June - Rainy season starts
  7: 1.2, // July - Summer vacations
  8: 1.15, // August - Summer vacations
  9: 0.9, // September - Rainy season
  10: 0.95, // October
  11: 1.0, // November
  12: 1.3, // December - Holidays (highest demand)
};

/**
 * Features that add value (percentage increase)
 */
export const FEATURE_VALUE_MULTIPLIERS: Record<string, number> = {
  gps: 1.02,
  bluetooth: 1.01,
  backup_camera: 1.02,
  apple_carplay: 1.03,
  android_auto: 1.03,
  sunroof: 1.05,
  heated_seats: 1.03,
  leather_seats: 1.04,
  child_seat: 1.01,
  bike_rack: 1.01,
  ski_rack: 1.01,
  toll_pass: 1.02,
  usb_charger: 1.01,
  aux_input: 1.01,
  keyless_entry: 1.02,
  remote_start: 1.03,
};
