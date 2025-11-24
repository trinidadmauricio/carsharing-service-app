/**
 * Risk Score Types
 * Risk assessment and scoring interfaces
 */

export interface RiskScore {
  score: number; // 0-100 (higher = lower risk)
  level: RiskLevel;
  factors: RiskFactor[];
  canInstantBook: boolean;
  requiresManualApproval: boolean;
  restrictions: string[];
  calculatedAt: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'very_high';

export interface RiskFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface RiskCalculationInput {
  userId: string;
  idVerified: boolean;
  faceMatchVerified: boolean;
  completedTrips: number;
  averageRating: number;
  atFaultClaims: number;
  accountAgeMonths: number;
  driverAge: number;
}

export interface BookingEligibility {
  eligible: boolean;
  riskScore: RiskScore;
  canInstantBook: boolean;
  requiresApproval: boolean;
  restrictions: string[];
  blockedReason?: string;
}

export const RISK_THRESHOLDS = {
  LOW: 80,
  MEDIUM: 60,
  HIGH: 40,
} as const;

export const RISK_WEIGHTS = {
  IDENTITY_VERIFICATION: 20,
  TRIP_HISTORY: 15,
  RATING_EXCELLENT: 10,
  RATING_GOOD: 5,
  CLAIM_PENALTY: 10,
  ESTABLISHED_ACCOUNT: 5,
  YOUNG_DRIVER: 10,
} as const;
