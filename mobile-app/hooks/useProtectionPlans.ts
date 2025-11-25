/**
 * useProtectionPlans Hook
 * Manages protection plan selection and pricing calculations
 */

import { useState, useMemo, useCallback } from 'react';
import { GUEST_PROTECTION_PLANS, HOST_PROTECTION_PLANS } from '@/types/protection';
import type { ProtectionPlan, ProtectionTier } from '@/types/protection';

interface UseProtectionPlansParams {
  type: 'guest' | 'host';
  tripDays?: number; // For calculating total price
}

interface UseProtectionPlansReturn {
  plans: ProtectionPlan[];
  selectedPlan: ProtectionPlan | null;
  recommendedPlan: ProtectionPlan | null;
  selectPlan: (planId: string) => void;
  getTotalPrice: (planId: string) => number;
  comparePlans: (planId1: string, planId2: string) => PlanComparison;
  resetSelection: () => void;
}

interface PlanComparison {
  plan1: ProtectionPlan;
  plan2: ProtectionPlan;
  differences: {
    price?: { plan1: number; plan2: number };
    deductible: { plan1: number; plan2: number };
    liabilityCoverage: { plan1: number; plan2: number };
    uniqueFeatures1: string[];
    uniqueFeatures2: string[];
    commonFeatures: string[];
  };
}

export function useProtectionPlans({
  type,
  tripDays = 1,
}: UseProtectionPlansParams): UseProtectionPlansReturn {
  const plans = useMemo(
    () => (type === 'guest' ? GUEST_PROTECTION_PLANS : HOST_PROTECTION_PLANS),
    [type]
  );

  const recommendedPlan = useMemo(
    () => plans.find((plan) => plan.recommended) || null,
    [plans]
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    recommendedPlan?.id || null
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  const selectPlan = useCallback((planId: string): void => {
    setSelectedPlanId(planId);
  }, []);

  const resetSelection = useCallback((): void => {
    setSelectedPlanId(recommendedPlan?.id || null);
  }, [recommendedPlan]);

  const getTotalPrice = useCallback(
    (planId: string): number => {
      const plan = plans.find((p) => p.id === planId);
      if (!plan || !plan.price) return 0;
      return plan.price * tripDays;
    },
    [plans, tripDays]
  );

  const comparePlans = useCallback(
    (planId1: string, planId2: string): PlanComparison => {
      const plan1 = plans.find((p) => p.id === planId1);
      const plan2 = plans.find((p) => p.id === planId2);

      if (!plan1 || !plan2) {
        throw new Error('Invalid plan IDs for comparison');
      }

      const features1 = new Set(plan1.features);
      const features2 = new Set(plan2.features);

      const uniqueFeatures1 = plan1.features.filter((f) => !features2.has(f));
      const uniqueFeatures2 = plan2.features.filter((f) => !features1.has(f));
      const commonFeatures = plan1.features.filter((f) => features2.has(f));

      const differences: PlanComparison['differences'] = {
        deductible: { plan1: plan1.deductible, plan2: plan2.deductible },
        liabilityCoverage: {
          plan1: plan1.liabilityCoverage,
          plan2: plan2.liabilityCoverage,
        },
        uniqueFeatures1,
        uniqueFeatures2,
        commonFeatures,
      };

      if (plan1.price !== undefined && plan2.price !== undefined) {
        differences.price = {
          plan1: plan1.price * tripDays,
          plan2: plan2.price * tripDays,
        };
      }

      return {
        plan1,
        plan2,
        differences,
      };
    },
    [plans, tripDays]
  );

  return {
    plans,
    selectedPlan,
    recommendedPlan,
    selectPlan,
    getTotalPrice,
    comparePlans,
    resetSelection,
  };
}

/**
 * Helper function to format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper function to get tier color
 */
export function getTierColor(tier: ProtectionTier): {
  light: string;
  dark: string;
} {
  switch (tier) {
    case 'basic':
      return { light: '#6B7280', dark: '#9CA3AF' };
    case 'standard':
      return { light: '#3B82F6', dark: '#60A5FA' };
    case 'premium':
      return { light: '#8B5CF6', dark: '#A78BFA' };
    case 'premier':
      return { light: '#EC4899', dark: '#F472B6' };
    case 'elite':
      return { light: '#F59E0B', dark: '#FBBF24' };
  }
}
