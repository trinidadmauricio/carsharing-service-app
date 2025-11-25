/**
 * Pricing Service - Mock Implementation
 * Smart pricing calculations with realistic algorithms
 */

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
import {
  BASE_PRICES_BY_TYPE,
  LOCATION_MULTIPLIERS,
  SEASONAL_FACTORS,
  FEATURE_VALUE_MULTIPLIERS,
  PLATFORM_FEES,
} from '../../../types/pricing';

/**
 * Mock delay to simulate API call
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate vehicle age depreciation factor
 */
function getAgeDepreciationFactor(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (age <= 1) return 1.1; // New cars command premium
  if (age <= 3) return 1.0; // Recent cars hold value
  if (age <= 5) return 0.95;
  if (age <= 8) return 0.85;
  if (age <= 12) return 0.75;
  return 0.65; // Older than 12 years
}

/**
 * Calculate features multiplier
 */
function getFeaturesMultiplier(features: string[]): number {
  let multiplier = 1.0;

  for (const feature of features) {
    const featureValue = FEATURE_VALUE_MULTIPLIERS[feature] || 1.0;
    multiplier *= featureValue;
  }

  return multiplier;
}

/**
 * Calculate host reputation multiplier
 */
function getHostReputationMultiplier(
  rating?: number,
  tripsCompleted?: number,
  responseRate?: number
): number {
  let multiplier = 1.0;

  // Rating factor
  if (rating) {
    if (rating >= 4.8) multiplier *= 1.05;
    else if (rating >= 4.5) multiplier *= 1.02;
    else if (rating < 4.0) multiplier *= 0.95;
  }

  // Experience factor
  if (tripsCompleted) {
    if (tripsCompleted >= 100) multiplier *= 1.03;
    else if (tripsCompleted >= 50) multiplier *= 1.02;
    else if (tripsCompleted >= 10) multiplier *= 1.01;
  }

  // Response rate factor
  if (responseRate && responseRate >= 0.9) {
    multiplier *= 1.02;
  }

  return multiplier;
}

/**
 * Get seasonal factor for current month
 */
function getCurrentSeasonalFactor(): number {
  const currentMonth = new Date().getMonth() + 1;
  return SEASONAL_FACTORS[currentMonth] || 1.0;
}

/**
 * Calculate confidence level based on data availability
 */
function calculateConfidence(factors: PricingFactors): {
  level: 'low' | 'medium' | 'high';
  score: number;
} {
  let score = 50; // Base score

  // Market data available
  if (factors.marketData) {
    score += 30;
  }

  // Host reputation data available
  if (factors.hostRating && factors.hostTripsCompleted) {
    score += 15;
  }

  // Recent vehicle (better data)
  if (factors.year >= new Date().getFullYear() - 5) {
    score += 5;
  }

  const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';

  return { level, score: Math.min(score, 100) };
}

/**
 * Calculate smart price for a vehicle
 */
async function calculateSmartPrice(factors: PricingFactors): Promise<SmartPriceResult> {
  await delay(800); // Simulate calculation time

  // Start with base price for vehicle type
  let basePrice = BASE_PRICES_BY_TYPE[factors.vehicleType] || 50;

  // Apply adjustments
  const ageDepreciation = getAgeDepreciationFactor(factors.year);
  const locationMultiplier =
    LOCATION_MULTIPLIERS[factors.location.city] || LOCATION_MULTIPLIERS.default;
  const seasonalFactor = getCurrentSeasonalFactor();
  const featuresMultiplier = getFeaturesMultiplier(factors.features);
  const hostMultiplier = getHostReputationMultiplier(
    factors.hostRating,
    factors.hostTripsCompleted,
    factors.hostResponseRate
  );

  // Demand adjustment (if market data available)
  let demandMultiplier = 1.0;
  if (factors.marketData) {
    const { demandLevel, competitorCount } = factors.marketData;

    if (demandLevel === 'high') demandMultiplier = 1.15;
    else if (demandLevel === 'low') demandMultiplier = 0.9;

    // Adjust for competition
    if (competitorCount > 20) demandMultiplier *= 0.95;
    else if (competitorCount < 5) demandMultiplier *= 1.05;
  }

  // Instant book bonus
  const instantBookMultiplier = factors.instantBookEnabled ? 1.05 : 1.0;

  // Calculate adjustments for breakdown
  const vehicleTypeAdjustment = basePrice * (ageDepreciation - 1);
  const locationAdjustment = basePrice * ageDepreciation * (locationMultiplier - 1);
  const demandAdjustment =
    basePrice * ageDepreciation * locationMultiplier * (demandMultiplier - 1);
  const featuresAdjustment =
    basePrice *
    ageDepreciation *
    locationMultiplier *
    demandMultiplier *
    (featuresMultiplier - 1);
  const hostReputationAdjustment =
    basePrice *
    ageDepreciation *
    locationMultiplier *
    demandMultiplier *
    featuresMultiplier *
    (hostMultiplier - 1);

  // Calculate final recommended rate
  const recommendedDailyRate = Math.round(
    basePrice *
      ageDepreciation *
      locationMultiplier *
      seasonalFactor *
      demandMultiplier *
      featuresMultiplier *
      hostMultiplier *
      instantBookMultiplier
  );

  // Calculate range (±15%)
  const minRecommended = Math.round(recommendedDailyRate * 0.85);
  const maxRecommended = Math.round(recommendedDailyRate * 1.15);

  // Calculate confidence
  const confidence = calculateConfidence(factors);

  // Determine competitive position
  let competitivePosition: 'below' | 'average' | 'above' = 'average';
  if (factors.marketData) {
    const { averageDailyRate } = factors.marketData;
    if (recommendedDailyRate < averageDailyRate * 0.9) competitivePosition = 'below';
    else if (recommendedDailyRate > averageDailyRate * 1.1) competitivePosition = 'above';
  }

  // Estimate booking rate based on competitive position
  let estimatedBookingRate = 50;
  if (competitivePosition === 'below') estimatedBookingRate = 75;
  else if (competitivePosition === 'above') estimatedBookingRate = 30;

  // Suggested discounts
  const suggestedWeeklyDiscount = 10; // 10% for 7+ days
  const suggestedMonthlyDiscount = 20; // 20% for 28+ days

  // Calculate earnings (assuming standard protection plan - 75% to host)
  const platformFee = PLATFORM_FEES.standard;
  const hostEarningsPercentage = 100 - platformFee;

  const dailyEarnings = Math.round((recommendedDailyRate * hostEarningsPercentage) / 100);
  const weeklyEarnings = dailyEarnings * 7;
  const monthlyEarnings = Math.round(dailyEarnings * 15); // Assume 50% utilization

  return {
    recommendedDailyRate,
    minRecommended,
    maxRecommended,
    confidenceLevel: confidence.level,
    confidenceScore: confidence.score,
    marketInsights: {
      competitivePosition,
      estimatedBookingRate,
      suggestedWeeklyDiscount,
      suggestedMonthlyDiscount,
    },
    breakdown: {
      basePrice,
      vehicleTypeAdjustment,
      locationAdjustment,
      demandAdjustment,
      featuresAdjustment,
      hostReputationAdjustment,
    },
    earningsEstimate: {
      daily: dailyEarnings,
      weekly: weeklyEarnings,
      monthly: monthlyEarnings,
      platformFee,
    },
  };
}

/**
 * Get market price range
 */
async function getMarketPriceRange(
  vehicleType: VehicleType,
  city: string,
  _state: string
): Promise<MarketPriceRange> {
  await delay(500);

  const basePrice = BASE_PRICES_BY_TYPE[vehicleType];
  const locationMultiplier = LOCATION_MULTIPLIERS[city] || LOCATION_MULTIPLIERS.default;

  const averagePrice = Math.round(basePrice * locationMultiplier);
  const minPrice = Math.round(averagePrice * 0.7);
  const maxPrice = Math.round(averagePrice * 1.5);

  return {
    vehicleType,
    city,
    minPrice,
    maxPrice,
    averagePrice,
    sampleSize: 15 + Math.floor(Math.random() * 20), // 15-35 listings
  };
}

/**
 * Get quick estimate
 */
async function getQuickEstimate(
  input: PricingCalculatorInput
): Promise<{ estimatedRate: number; range: { min: number; max: number } }> {
  await delay(300);

  const basePrice = BASE_PRICES_BY_TYPE[input.vehicleType];
  const ageDepreciation = getAgeDepreciationFactor(input.year);
  const locationMultiplier =
    LOCATION_MULTIPLIERS[input.city] || LOCATION_MULTIPLIERS.default;
  const featuresMultiplier = getFeaturesMultiplier(input.features);
  const instantBookMultiplier = input.instantBookEnabled ? 1.05 : 1.0;

  const estimatedRate = Math.round(
    basePrice * ageDepreciation * locationMultiplier * featuresMultiplier * instantBookMultiplier
  );

  return {
    estimatedRate,
    range: {
      min: Math.round(estimatedRate * 0.85),
      max: Math.round(estimatedRate * 1.15),
    },
  };
}

/**
 * Get pricing history
 */
async function getPricingHistory(
  vehicleId: string,
  days: number = 30
): Promise<PricingHistory[]> {
  await delay(600);

  const history: PricingHistory[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    history.push({
      vehicleId,
      date: date.toISOString().split('T')[0],
      dailyRate: 45 + Math.floor(Math.random() * 20), // $45-65
      bookingRate: 30 + Math.floor(Math.random() * 40), // 30-70%
      viewCount: Math.floor(Math.random() * 50),
      inquiryCount: Math.floor(Math.random() * 10),
      bookingCount: Math.floor(Math.random() * 3),
    });
  }

  return history;
}

/**
 * Get dynamic pricing suggestion
 */
async function getDynamicSuggestion(
  vehicleId: string
): Promise<DynamicPricingSuggestion | null> {
  await delay(400);

  // 50% chance of having a suggestion
  if (Math.random() < 0.5) {
    return null;
  }

  const currentRate = 50;
  const suggestedRate = currentRate + (Math.random() > 0.5 ? 5 : -5);
  const changePercentage = ((suggestedRate - currentRate) / currentRate) * 100;

  const reasons = [
    'High demand in your area this weekend',
    'Similar vehicles have reduced prices',
    'Upcoming holiday - increase expected',
    'Low booking rate - consider price adjustment',
  ];

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);

  return {
    vehicleId,
    currentRate,
    suggestedRate,
    changePercentage: Math.round(changePercentage * 100) / 100,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    expectedImpact: {
      bookingRateChange: changePercentage > 0 ? -5 : 10,
      earningsChange: changePercentage > 0 ? 150 : 200,
    },
    validUntil: validUntil.toISOString(),
  };
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
  await delay(200);

  // Determine platform fee based on protection plan
  let platformFee: number = PLATFORM_FEES.standard;
  if (protectionPlanId.includes('basic')) platformFee = PLATFORM_FEES.basic as number;
  else if (protectionPlanId.includes('premium')) platformFee = PLATFORM_FEES.premium as number;

  const hostEarningsPercentage = 100 - platformFee;
  const dailyEarnings = (dailyRate * hostEarningsPercentage) / 100;

  // Calculate based on utilization rate
  const daysRentedPerMonth = 30 * utilizationRate;
  const daysRentedPerYear = 365 * utilizationRate;

  return {
    daily: Math.round(dailyEarnings),
    weekly: Math.round(dailyEarnings * 7 * utilizationRate),
    monthly: Math.round(dailyEarnings * daysRentedPerMonth),
    yearly: Math.round(dailyEarnings * daysRentedPerYear),
    platformFee,
  };
}

/**
 * Export mock implementation
 */
export const pricingMock: PricingService = {
  calculateSmartPrice,
  getMarketPriceRange,
  getQuickEstimate,
  getPricingHistory,
  getDynamicSuggestion,
  calculateEarnings,
};
