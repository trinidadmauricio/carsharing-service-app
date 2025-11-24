/**
 * Protection Plan Types
 * Insurance and protection plan interfaces
 */

export interface ProtectionPlan {
  id: string;
  name: string;
  type: 'host' | 'guest';
  tier: ProtectionTier;
  earningsPercentage?: number; // Only for hosts (60-85%)
  deductible: number;
  liabilityCoverage: number;
  features: string[];
  price?: number; // Only for guests (daily rate)
  description: string;
  recommended?: boolean;
}

export type ProtectionTier =
  | 'basic'
  | 'standard'
  | 'premium'
  | 'premier'
  | 'elite';

export const HOST_PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'host_basic',
    name: 'Basic',
    type: 'host',
    tier: 'basic',
    earningsPercentage: 85,
    deductible: 2500,
    liabilityCoverage: 750000,
    description: 'Essential coverage with maximum earnings',
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$2,500 deductible',
    ],
  },
  {
    id: 'host_standard',
    name: 'Standard',
    type: 'host',
    tier: 'standard',
    earningsPercentage: 75,
    deductible: 1000,
    liabilityCoverage: 750000,
    description: 'Balanced protection with roadside assistance',
    recommended: true,
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$1,000 deductible',
      '24/7 roadside assistance',
    ],
  },
  {
    id: 'host_premium',
    name: 'Premium',
    type: 'host',
    tier: 'premium',
    earningsPercentage: 70,
    deductible: 500,
    liabilityCoverage: 750000,
    description: 'Enhanced protection with faster claims',
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$500 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
    ],
  },
  {
    id: 'host_premier',
    name: 'Premier',
    type: 'host',
    tier: 'premier',
    earningsPercentage: 65,
    deductible: 250,
    liabilityCoverage: 750000,
    description: 'Comprehensive coverage with income protection',
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$250 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
      'Lost income coverage',
    ],
  },
  {
    id: 'host_elite',
    name: 'Elite',
    type: 'host',
    tier: 'elite',
    earningsPercentage: 60,
    deductible: 0,
    liabilityCoverage: 750000,
    description: 'Maximum protection with zero deductible',
    features: [
      'Third-party liability ($750K)',
      'Physical damage reimbursement',
      '$0 deductible',
      '24/7 roadside assistance',
      'Expedited claims processing',
      'Lost income coverage',
      'Wear & tear coverage',
    ],
  },
];

export const GUEST_PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'guest_minimum',
    name: 'Minimum',
    type: 'guest',
    tier: 'basic',
    deductible: 3000,
    liabilityCoverage: 50000,
    price: 0,
    description: 'State minimum coverage included with booking',
    features: [
      'State minimum liability',
      '$3,000 damage responsibility',
    ],
  },
  {
    id: 'guest_standard',
    name: 'Standard',
    type: 'guest',
    tier: 'standard',
    deductible: 500,
    liabilityCoverage: 750000,
    price: 15,
    description: 'Recommended protection for peace of mind',
    recommended: true,
    features: [
      'Liability coverage ($750K)',
      '$500 deductible',
      'Roadside assistance',
    ],
  },
  {
    id: 'guest_premier',
    name: 'Premier',
    type: 'guest',
    tier: 'premier',
    deductible: 0,
    liabilityCoverage: 750000,
    price: 30,
    description: 'Complete protection with zero worry',
    features: [
      'Liability coverage ($750K)',
      '$0 deductible',
      'Roadside assistance',
      'Personal effects coverage',
      'Trip interruption coverage',
    ],
  },
];

export interface ProtectionCoverage {
  planId: string;
  plan: ProtectionPlan;
  startDate: string;
  endDate: string;
  totalPremium: number;
  status: 'active' | 'expired' | 'cancelled';
}

export interface ClaimEligibility {
  eligible: boolean;
  reason?: string;
  deductible: number;
  maxCoverage: number;
  withinTimeWindow: boolean;
  requiredDocuments: string[];
}
