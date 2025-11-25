/**
 * ProtectionSelector Organism
 * Complete protection plan selection interface with comparison modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, palette } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Button } from '@/components/atoms/Button';
import { ProtectionPlanCard } from '@/components/molecules/ProtectionPlanCard';
import { useProtectionPlans, formatCurrency } from '@/hooks/useProtectionPlans';
import type { ProtectionPlan } from '@/types/protection';

interface ProtectionSelectorProps {
  type: 'guest' | 'host';
  tripDays?: number;
  onPlanSelected?: (plan: ProtectionPlan) => void;
  initialPlanId?: string;
}

export const ProtectionSelector: React.FC<ProtectionSelectorProps> = ({
  type,
  tripDays = 1,
  onPlanSelected,
  initialPlanId,
}) => {
  const colors = useThemeColors();
  const {
    plans,
    selectedPlan,
    recommendedPlan,
    selectPlan,
    getTotalPrice,
    comparePlans,
  } = useProtectionPlans({ type, tripDays });

  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPlanId, setComparisonPlanId] = useState<string | null>(null);

  // Initialize selection from props
  React.useEffect(() => {
    if (initialPlanId && plans.find((p) => p.id === initialPlanId)) {
      selectPlan(initialPlanId);
    }
  }, [initialPlanId, plans, selectPlan]);

  const handlePlanSelect = (planId: string): void => {
    selectPlan(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan && onPlanSelected) {
      onPlanSelected(plan);
    }
  };

  const handleCompare = (planId: string): void => {
    setComparisonPlanId(planId);
    setShowComparison(true);
  };

  const comparison =
    selectedPlan && comparisonPlanId
      ? comparePlans(selectedPlan.id, comparisonPlanId)
      : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[textStyles.h2, { color: colors.text.primary }]}>
          Choose Protection
        </Text>
        <Text style={[textStyles.body1, { color: colors.text.secondary, marginTop: spacing['2'] }]}>
          {type === 'guest'
            ? 'Select coverage for your trip'
            : 'Choose your protection plan for hosting'}
        </Text>
      </View>

      {/* Plans List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.plansContainer}
        showsVerticalScrollIndicator={false}
      >
        {plans.map((plan) => (
          <View key={plan.id}>
            <ProtectionPlanCard
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              tripDays={tripDays}
              onSelect={handlePlanSelect}
              showPrice={type === 'guest'}
            />

            {/* Compare Button */}
            {selectedPlan && selectedPlan.id !== plan.id && (
              <Pressable
                style={styles.compareButton}
                onPress={() => handleCompare(plan.id)}
                accessibilityLabel={`Compare ${plan.name} with ${selectedPlan.name}`}
              >
                <Ionicons
                  name="git-compare-outline"
                  size={16}
                  color={colors.interactive.primary}
                />
                <Text
                  style={[
                    textStyles.buttonSmall,
                    { color: colors.interactive.primary },
                  ]}
                >
                  {`Compare with ${selectedPlan.name}`}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Comparison Modal */}
      {comparison && (
        <Modal
          visible={showComparison}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowComparison(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background.primary },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[textStyles.h2, { color: colors.text.primary }]}>
                Plan Comparison
              </Text>
              <Pressable
                onPress={() => setShowComparison(false)}
                accessibilityLabel="Close comparison"
              >
                <Ionicons name="close" size={28} color={colors.text.primary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Plans Being Compared */}
              <View style={styles.comparisonHeader}>
                <View style={styles.comparisonPlan}>
                  <Text
                    style={[textStyles.h3, { color: colors.text.primary }]}
                  >
                    {comparison.plan1.name}
                  </Text>
                  {comparison.plan1.recommended && (
                    <View
                      style={[
                        styles.recommendedBadge,
                        { backgroundColor: colors.interactive.primary },
                      ]}
                    >
                      <Text
                        style={[
                          textStyles.caption,
                          { color: colors.text.inverse },
                        ]}
                      >
                        Recommended
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name="git-compare-outline"
                  size={24}
                  color={colors.text.tertiary}
                />
                <View style={styles.comparisonPlan}>
                  <Text
                    style={[textStyles.h3, { color: colors.text.primary }]}
                  >
                    {comparison.plan2.name}
                  </Text>
                  {comparison.plan2.recommended && (
                    <View
                      style={[
                        styles.recommendedBadge,
                        { backgroundColor: colors.interactive.primary },
                      ]}
                    >
                      <Text
                        style={[
                          textStyles.caption,
                          { color: colors.text.inverse },
                        ]}
                      >
                        Recommended
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Price Comparison (Guest only) */}
              {type === 'guest' && comparison.differences.price && (
                <ComparisonRow
                  label="Total Price"
                  value1={formatCurrency(comparison.differences.price.plan1)}
                  value2={formatCurrency(comparison.differences.price.plan2)}
                  colors={colors}
                />
              )}

              {/* Deductible Comparison */}
              <ComparisonRow
                label="Deductible"
                value1={
                  comparison.differences.deductible.plan1 === 0
                    ? '$0'
                    : formatCurrency(comparison.differences.deductible.plan1)
                }
                value2={
                  comparison.differences.deductible.plan2 === 0
                    ? '$0'
                    : formatCurrency(comparison.differences.deductible.plan2)
                }
                colors={colors}
                highlight1={comparison.differences.deductible.plan1 === 0}
                highlight2={comparison.differences.deductible.plan2 === 0}
              />

              {/* Liability Comparison */}
              <ComparisonRow
                label="Liability Coverage"
                value1={formatCurrency(
                  comparison.differences.liabilityCoverage.plan1
                )}
                value2={formatCurrency(
                  comparison.differences.liabilityCoverage.plan2
                )}
                colors={colors}
              />

              {/* Common Features */}
              {comparison.differences.commonFeatures.length > 0 && (
                <View style={styles.featuresSection}>
                  <Text
                    style={[
                      textStyles.buttonMedium,
                      { color: colors.text.primary, marginBottom: spacing['2'] },
                    ]}
                  >
                    Common Features
                  </Text>
                  {comparison.differences.commonFeatures.map((feature, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={palette.success[600]}
                      />
                      <Text
                        style={[
                          textStyles.body2,
                          { color: colors.text.secondary },
                        ]}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Unique Features */}
              <View style={styles.uniqueFeaturesContainer}>
                {/* Plan 1 Unique Features */}
                {comparison.differences.uniqueFeatures1.length > 0 && (
                  <View style={styles.uniqueColumn}>
                    <Text
                      style={[
                        textStyles.buttonMedium,
                        { color: colors.text.primary, marginBottom: spacing['2'] },
                      ]}
                    >
                      {`Only in ${comparison.plan1.name}`}
                    </Text>
                    {comparison.differences.uniqueFeatures1.map(
                      (feature, idx) => (
                        <View key={idx} style={styles.featureRow}>
                          <Ionicons
                            name="add-circle"
                            size={16}
                            color={colors.interactive.primary}
                          />
                          <Text
                            style={[
                              textStyles.body2,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {feature}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                {/* Plan 2 Unique Features */}
                {comparison.differences.uniqueFeatures2.length > 0 && (
                  <View style={styles.uniqueColumn}>
                    <Text
                      style={[
                        textStyles.buttonMedium,
                        { color: colors.text.primary, marginBottom: spacing['2'] },
                      ]}
                    >
                      {`Only in ${comparison.plan2.name}`}
                    </Text>
                    {comparison.differences.uniqueFeatures2.map(
                      (feature, idx) => (
                        <View key={idx} style={styles.featureRow}>
                          <Ionicons
                            name="add-circle"
                            size={16}
                            color={colors.interactive.primary}
                          />
                          <Text
                            style={[
                              textStyles.body2,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {feature}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View
              style={[
                styles.modalFooter,
                { borderTopColor: colors.border.default },
              ]}
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => setShowComparison(false)}
              >
                Close Comparison
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Helper Component for Comparison Rows
interface ComparisonRowProps {
  label: string;
  value1: string;
  value2: string;
  colors: ReturnType<typeof useThemeColors>;
  highlight1?: boolean;
  highlight2?: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({
  label,
  value1,
  value2,
  colors,
  highlight1 = false,
  highlight2 = false,
}) => (
  <View style={styles.comparisonRow}>
    <Text style={[textStyles.body1, { color: colors.text.tertiary, flex: 1 }]}>
      {label}
    </Text>
    <Text
      style={[
        textStyles.buttonMedium,
        {
          color: highlight1 ? palette.success[600] : colors.text.primary,
          flex: 1,
          textAlign: 'center',
        },
      ]}
    >
      {value1}
    </Text>
    <Text
      style={[
        textStyles.buttonMedium,
        {
          color: highlight2 ? palette.success[600] : colors.text.primary,
          flex: 1,
          textAlign: 'center',
        },
      ]}
    >
      {value2}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
    paddingBottom: spacing['3'],
  },
  scrollView: {
    flex: 1,
  },
  plansContainer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['6'],
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
    marginTop: -spacing['2'],
    marginBottom: spacing['3'],
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing['4'],
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['4'],
  },
  comparisonPlan: {
    flex: 1,
    alignItems: 'center',
    gap: spacing['1'],
  },
  recommendedBadge: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  featuresSection: {
    marginTop: spacing['4'],
    paddingTop: spacing['4'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  uniqueFeaturesContainer: {
    marginTop: spacing['4'],
    gap: spacing['4'],
  },
  uniqueColumn: {
    gap: spacing['2'],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['1'],
  },
  modalFooter: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    borderTopWidth: 1,
  },
});
