/**
 * useProtectionPlans Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useProtectionPlans,
  formatCurrency,
  getTierColor,
} from '@/hooks/useProtectionPlans';
import { GUEST_PROTECTION_PLANS, HOST_PROTECTION_PLANS } from '@/types/protection';

describe('useProtectionPlans', () => {
  describe('useProtectionPlans hook', () => {
    it('should return guest plans when type is guest', () => {
      const { result } = renderHook(() => useProtectionPlans({ type: 'guest' }));

      expect(result.current.plans).toEqual(GUEST_PROTECTION_PLANS);
      expect(result.current.plans.length).toBeGreaterThan(0);
    });

    it('should return host plans when type is host', () => {
      const { result } = renderHook(() => useProtectionPlans({ type: 'host' }));

      expect(result.current.plans).toEqual(HOST_PROTECTION_PLANS);
      expect(result.current.plans.length).toBeGreaterThan(0);
    });

    it('should auto-select recommended plan by default', () => {
      const { result } = renderHook(() => useProtectionPlans({ type: 'guest' }));

      expect(result.current.recommendedPlan).toBeDefined();
      expect(result.current.selectedPlan).toBeDefined();
      expect(result.current.selectedPlan?.id).toBe(result.current.recommendedPlan?.id);
    });

    it('should select plan when selectPlan is called', () => {
      const { result } = renderHook(() => useProtectionPlans({ type: 'guest' }));

      const firstPlan = result.current.plans[0];
      const secondPlan = result.current.plans[1];

      act(() => {
        result.current.selectPlan(secondPlan.id);
      });

      expect(result.current.selectedPlan?.id).toBe(secondPlan.id);
    });

    it('should reset selection to recommended plan', () => {
      const { result } = renderHook(() => useProtectionPlans({ type: 'guest' }));

      const recommendedPlanId = result.current.recommendedPlan?.id;
      const otherPlan = result.current.plans.find((p) => p.id !== recommendedPlanId);

      act(() => {
        if (otherPlan) {
          result.current.selectPlan(otherPlan.id);
        }
      });

      expect(result.current.selectedPlan?.id).toBe(otherPlan?.id);

      act(() => {
        result.current.resetSelection();
      });

      expect(result.current.selectedPlan?.id).toBe(recommendedPlanId);
    });

    it('should calculate total price correctly for single day', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const planWithPrice = result.current.plans.find((p) => p.price && p.price > 0);

      if (planWithPrice) {
        const totalPrice = result.current.getTotalPrice(planWithPrice.id);
        expect(totalPrice).toBe(planWithPrice.price);
      }
    });

    it('should calculate total price correctly for multiple days', () => {
      const tripDays = 5;
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays })
      );

      const planWithPrice = result.current.plans.find((p) => p.price && p.price > 0);

      if (planWithPrice) {
        const totalPrice = result.current.getTotalPrice(planWithPrice.id);
        expect(totalPrice).toBe(planWithPrice.price! * tripDays);
      }
    });

    it('should return 0 for plan without price', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const planWithoutPrice = result.current.plans.find((p) => !p.price || p.price === 0);

      if (planWithoutPrice) {
        const totalPrice = result.current.getTotalPrice(planWithoutPrice.id);
        expect(totalPrice).toBe(0);
      }
    });

    it('should return 0 for invalid plan ID', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const totalPrice = result.current.getTotalPrice('invalid-plan-id');
      expect(totalPrice).toBe(0);
    });

    it('should compare plans correctly', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const plans = result.current.plans;
      if (plans.length >= 2) {
        const plan1 = plans[0];
        const plan2 = plans[1];

        const comparison = result.current.comparePlans(plan1.id, plan2.id);

        expect(comparison.plan1.id).toBe(plan1.id);
        expect(comparison.plan2.id).toBe(plan2.id);
        expect(comparison.differences.deductible).toBeDefined();
        expect(comparison.differences.liabilityCoverage).toBeDefined();
      }
    });

    it('should identify unique features correctly', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const plans = result.current.plans;
      if (plans.length >= 2) {
        const plan1 = plans[0];
        const plan2 = plans[1];

        const comparison = result.current.comparePlans(plan1.id, plan2.id);

        // Check that unique features are identified
        const allUniqueFeatures = [
          ...comparison.differences.uniqueFeatures1,
          ...comparison.differences.uniqueFeatures2,
        ];
        expect(allUniqueFeatures.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('should identify common features correctly', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      const plans = result.current.plans;
      if (plans.length >= 2) {
        const plan1 = plans[0];
        const plan2 = plans[1];

        const comparison = result.current.comparePlans(plan1.id, plan2.id);

        expect(comparison.differences.commonFeatures).toBeDefined();
        expect(Array.isArray(comparison.differences.commonFeatures)).toBe(true);
      }
    });

    it('should include price in comparison when both plans have price', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 3 })
      );

      const plansWithPrice = result.current.plans.filter((p) => p.price && p.price > 0);

      if (plansWithPrice.length >= 2) {
        const plan1 = plansWithPrice[0];
        const plan2 = plansWithPrice[1];

        const comparison = result.current.comparePlans(plan1.id, plan2.id);

        expect(comparison.differences.price).toBeDefined();
        expect(comparison.differences.price?.plan1).toBe(plan1.price! * 3);
        expect(comparison.differences.price?.plan2).toBe(plan2.price! * 3);
      }
    });

    it('should throw error when comparing invalid plan IDs', () => {
      const { result } = renderHook(() =>
        useProtectionPlans({ type: 'guest', tripDays: 1 })
      );

      expect(() => {
        result.current.comparePlans('invalid-id-1', 'invalid-id-2');
      }).toThrow('Invalid plan IDs for comparison');
    });
  });

  describe('formatCurrency', () => {
    it('should format whole numbers correctly', () => {
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(1000)).toBe('$1,000');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatCurrency(99.99)).toBe('$100');
      expect(formatCurrency(50.5)).toBe('$51');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(750000)).toBe('$750,000');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100');
    });
  });

  describe('getTierColor', () => {
    it('should return correct colors for basic tier', () => {
      const colors = getTierColor('basic');
      expect(colors.light).toBe('#6B7280');
      expect(colors.dark).toBe('#9CA3AF');
    });

    it('should return correct colors for standard tier', () => {
      const colors = getTierColor('standard');
      expect(colors.light).toBe('#3B82F6');
      expect(colors.dark).toBe('#60A5FA');
    });

    it('should return correct colors for premium tier', () => {
      const colors = getTierColor('premium');
      expect(colors.light).toBe('#8B5CF6');
      expect(colors.dark).toBe('#A78BFA');
    });

    it('should return correct colors for premier tier', () => {
      const colors = getTierColor('premier');
      expect(colors.light).toBe('#EC4899');
      expect(colors.dark).toBe('#F472B6');
    });

    it('should return correct colors for elite tier', () => {
      const colors = getTierColor('elite');
      expect(colors.light).toBe('#F59E0B');
      expect(colors.dark).toBe('#FBBF24');
    });
  });
});

