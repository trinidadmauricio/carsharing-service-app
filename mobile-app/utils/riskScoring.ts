/**
 * Risk Scoring Utilities
 * Calculates guest risk scores for booking eligibility
 */

import type {
  RiskScore,
  RiskLevel,
  RiskFactor,
  RiskCalculationInput,
  BookingEligibility,
} from '@/types/riskScore';
import { RISK_THRESHOLDS, RISK_WEIGHTS } from '@/types/riskScore';

/**
 * Calculate guest risk score based on multiple factors
 * Score range: 0-100 (higher = lower risk = better)
 */
export function calculateGuestRiskScore(input: RiskCalculationInput): RiskScore {
  const factors: RiskFactor[] = [];
  let baseScore = 50; // Start at neutral

  // Identity Verification (20 points max)
  if (input.idVerified && input.faceMatchVerified) {
    baseScore += RISK_WEIGHTS.IDENTITY_VERIFICATION;
    factors.push({
      name: 'Full ID Verification',
      impact: 'positive',
      weight: RISK_WEIGHTS.IDENTITY_VERIFICATION,
      description: 'Government ID and face match verified',
    });
  } else if (input.idVerified) {
    baseScore += RISK_WEIGHTS.IDENTITY_VERIFICATION / 2;
    factors.push({
      name: 'Partial ID Verification',
      impact: 'positive',
      weight: RISK_WEIGHTS.IDENTITY_VERIFICATION / 2,
      description: 'Government ID verified',
    });
  } else {
    factors.push({
      name: 'No ID Verification',
      impact: 'negative',
      weight: -5,
      description: 'ID verification required',
    });
    baseScore -= 5;
  }

  // Trip History (15 points max)
  if (input.completedTrips >= 10) {
    baseScore += RISK_WEIGHTS.TRIP_HISTORY;
    factors.push({
      name: 'Experienced Renter',
      impact: 'positive',
      weight: RISK_WEIGHTS.TRIP_HISTORY,
      description: `${input.completedTrips} trips completed`,
    });
  } else if (input.completedTrips >= 5) {
    baseScore += RISK_WEIGHTS.TRIP_HISTORY / 2;
    factors.push({
      name: 'Moderate Experience',
      impact: 'positive',
      weight: RISK_WEIGHTS.TRIP_HISTORY / 2,
      description: `${input.completedTrips} trips completed`,
    });
  } else if (input.completedTrips === 0) {
    factors.push({
      name: 'First-time Renter',
      impact: 'neutral',
      weight: 0,
      description: 'No trip history',
    });
  }

  // Rating (10 points max for excellent, 5 for good)
  if (input.completedTrips > 0) {
    if (input.averageRating >= 4.8) {
      baseScore += RISK_WEIGHTS.RATING_EXCELLENT;
      factors.push({
        name: 'Excellent Rating',
        impact: 'positive',
        weight: RISK_WEIGHTS.RATING_EXCELLENT,
        description: `${input.averageRating.toFixed(1)} average rating`,
      });
    } else if (input.averageRating >= 4.5) {
      baseScore += RISK_WEIGHTS.RATING_GOOD;
      factors.push({
        name: 'Good Rating',
        impact: 'positive',
        weight: RISK_WEIGHTS.RATING_GOOD,
        description: `${input.averageRating.toFixed(1)} average rating`,
      });
    } else if (input.averageRating < 4.0) {
      baseScore -= 5;
      factors.push({
        name: 'Below Average Rating',
        impact: 'negative',
        weight: -5,
        description: `${input.averageRating.toFixed(1)} average rating`,
      });
    }
  }

  // Claims History (10 points penalty per at-fault claim)
  if (input.atFaultClaims > 0) {
    const penalty = input.atFaultClaims * RISK_WEIGHTS.CLAIM_PENALTY;
    baseScore -= penalty;
    factors.push({
      name: 'At-Fault Claims',
      impact: 'negative',
      weight: -penalty,
      description: `${input.atFaultClaims} at-fault claim(s)`,
    });
  }

  // Account Age (5 points max)
  if (input.accountAgeMonths >= 6) {
    baseScore += RISK_WEIGHTS.ESTABLISHED_ACCOUNT;
    factors.push({
      name: 'Established Account',
      impact: 'positive',
      weight: RISK_WEIGHTS.ESTABLISHED_ACCOUNT,
      description: `Account age: ${Math.floor(input.accountAgeMonths)} months`,
    });
  } else {
    factors.push({
      name: 'New Account',
      impact: 'neutral',
      weight: 0,
      description: `Account age: ${Math.floor(input.accountAgeMonths)} months`,
    });
  }

  // Driver Age (penalty for young drivers)
  if (input.driverAge < 21) {
    baseScore -= 15;
    factors.push({
      name: 'Minimum Age Driver',
      impact: 'negative',
      weight: -15,
      description: 'Drivers under 21 have higher risk',
    });
  } else if (input.driverAge < 25) {
    baseScore -= RISK_WEIGHTS.YOUNG_DRIVER;
    factors.push({
      name: 'Young Driver',
      impact: 'negative',
      weight: -RISK_WEIGHTS.YOUNG_DRIVER,
      description: 'Drivers under 25 have higher risk',
    });
  }

  // Cap score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, baseScore));

  // Determine risk level
  const level: RiskLevel =
    finalScore >= RISK_THRESHOLDS.LOW
      ? 'low'
      : finalScore >= RISK_THRESHOLDS.MEDIUM
      ? 'medium'
      : finalScore >= RISK_THRESHOLDS.HIGH
      ? 'high'
      : 'very_high';

  // Determine booking capabilities
  const canInstantBook = finalScore >= RISK_THRESHOLDS.MEDIUM && input.idVerified;
  const requiresManualApproval = finalScore < RISK_THRESHOLDS.HIGH;

  // Determine restrictions
  const restrictions: string[] = [];
  if (!input.idVerified) {
    restrictions.push('ID verification required before booking');
  }
  if (input.driverAge < 21) {
    restrictions.push('Minimum age requirement: 21 years');
  }
  if (input.atFaultClaims >= 2) {
    restrictions.push('Multiple at-fault claims - limited vehicle selection');
  }
  if (requiresManualApproval) {
    restrictions.push('Booking requires host approval');
  }

  return {
    score: Math.round(finalScore),
    level,
    factors,
    canInstantBook,
    requiresManualApproval,
    restrictions,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Check booking eligibility for a guest
 */
export function checkBookingEligibility(
  riskInput: RiskCalculationInput,
  vehicleInstantBook: boolean
): BookingEligibility {
  const riskScore = calculateGuestRiskScore(riskInput);

  // Determine if guest is blocked from booking
  let blockedReason: string | undefined;

  if (riskInput.driverAge < 21) {
    blockedReason = 'You must be at least 21 years old to rent a vehicle';
  } else if (riskInput.atFaultClaims >= 3) {
    blockedReason = 'Account suspended due to multiple at-fault claims';
  } else if (riskScore.score < 20) {
    blockedReason = 'Unable to approve booking at this time';
  }

  const eligible = !blockedReason;

  // Can instant book only if:
  // 1. Guest is eligible
  // 2. Guest risk score allows instant book
  // 3. Vehicle has instant book enabled
  const canInstantBook =
    eligible && riskScore.canInstantBook && vehicleInstantBook;

  // Requires approval if:
  // 1. Guest is eligible but score is below threshold
  // 2. OR vehicle doesn't have instant book
  const requiresApproval = eligible && (!riskScore.canInstantBook || !vehicleInstantBook);

  return {
    eligible,
    riskScore,
    canInstantBook,
    requiresApproval,
    restrictions: riskScore.restrictions,
    blockedReason,
  };
}

/**
 * Get risk level color for UI
 */
export function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return '#10B981'; // green-500
    case 'medium':
      return '#F59E0B'; // yellow-500
    case 'high':
      return '#EF4444'; // red-500
    case 'very_high':
      return '#DC2626'; // red-600
  }
}

/**
 * Get risk level label for UI
 */
export function getRiskLevelLabel(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'Low Risk';
    case 'medium':
      return 'Medium Risk';
    case 'high':
      return 'High Risk';
    case 'very_high':
      return 'Very High Risk';
  }
}

/**
 * Get requirements to improve risk score
 */
export function getImprovementSuggestions(riskScore: RiskScore): string[] {
  const suggestions: string[] = [];

  const hasIdVerification = riskScore.factors.some(
    (f) => f.name === 'Full ID Verification'
  );

  if (!hasIdVerification) {
    suggestions.push('Complete ID verification to improve your score');
  }

  const hasTrips = riskScore.factors.some((f) => f.name.includes('Renter'));
  if (!hasTrips) {
    suggestions.push('Complete your first trips to build a rental history');
  }

  const hasLowRating = riskScore.factors.some(
    (f) => f.name === 'Below Average Rating'
  );
  if (hasLowRating) {
    suggestions.push('Maintain good communication and vehicle care to improve ratings');
  }

  const hasClaims = riskScore.factors.some((f) => f.name === 'At-Fault Claims');
  if (hasClaims) {
    suggestions.push('Drive safely to avoid future claims');
  }

  return suggestions;
}
