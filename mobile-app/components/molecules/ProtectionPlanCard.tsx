/**
 * ProtectionPlanCard Component
 * Card displaying protection plan details with selection state
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, palette } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { getShadow } from '@/theme/shadows';
import type { ProtectionPlan } from '@/types/protection';
import { formatCurrency, getTierColor } from '@/hooks/useProtectionPlans';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProtectionPlanCardProps extends Omit<PressableProps, 'style'> {
  plan: ProtectionPlan;
  selected?: boolean;
  tripDays?: number;
  onSelect?: (planId: string) => void;
  showPrice?: boolean;
}

export const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = ({
  plan,
  selected = false,
  tripDays = 1,
  onSelect,
  showPrice = true,
  ...pressableProps
}) => {
  const colors = useThemeColors();
  const tierColors = getTierColor(plan.tier);

  const totalPrice = plan.price ? plan.price * tripDays : 0;
  const pricePerDay = plan.price || 0;

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      selected ? 1 : 0,
      [0, 1],
      [colors.border.default, colors.interactive.primary]
    );

    return {
      borderColor,
      transform: [
        {
          scale: withSpring(selected ? 1.02 : 1, {
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  }, [selected, colors]);

  const handlePress = (): void => {
    if (onSelect) {
      onSelect(plan.id);
    }
  };

  return (
    <AnimatedPressable
      {...pressableProps}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.name} protection plan, ${plan.description}`}
      style={[styles.container, animatedStyle]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[textStyles.h3, { color: colors.text.primary }]}>
            {plan.name}
          </Text>
          {plan.recommended && (
            <View
              style={[
                styles.recommendedBadge,
                { backgroundColor: colors.interactive.primary },
              ]}
            >
              <Text
                style={[
                  textStyles.caption,
                  { color: colors.text.inverse, fontWeight: '600' },
                ]}
              >
                Recommended
              </Text>
            </View>
          )}
        </View>

        {/* Selection Indicator */}
        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected
                ? colors.interactive.primary
                : colors.border.default,
              backgroundColor: selected
                ? colors.interactive.primary
                : 'transparent',
            },
          ]}
        >
          {selected && (
            <Ionicons name="checkmark" size={18} color={colors.text.inverse} />
          )}
        </View>
      </View>

      {/* Description */}
      <Text
        style={[textStyles.body2, { color: colors.text.secondary, marginTop: spacing['2'] }]}
      >
        {plan.description}
      </Text>

      {/* Price */}
      {showPrice && (
        <View style={styles.priceContainer}>
          {pricePerDay === 0 ? (
            <Text style={[textStyles.h2, { color: palette.success[600] }]}>
              Included
            </Text>
          ) : (
            <>
              <Text style={[textStyles.h2, { color: colors.text.primary }]}>
                {formatCurrency(totalPrice)}
              </Text>
              <Text style={[textStyles.body2, { color: colors.text.tertiary }]}>
                {`${formatCurrency(pricePerDay)}/day × ${tripDays} ${tripDays === 1 ? 'day' : 'days'}`}
              </Text>
            </>
          )}
        </View>
      )}

      {/* Coverage Details */}
      <View style={styles.coverageContainer}>
        <View style={styles.coverageRow}>
          <Text style={[textStyles.caption, { color: colors.text.tertiary }]}>
            Deductible
          </Text>
          <Text
            style={[
              textStyles.buttonSmall,
              {
                color:
                  plan.deductible === 0
                    ? palette.success[600]
                    : colors.text.primary,
              },
            ]}
          >
            {plan.deductible === 0 ? '$0' : formatCurrency(plan.deductible)}
          </Text>
        </View>
        <View style={styles.coverageRow}>
          <Text style={[textStyles.caption, { color: colors.text.tertiary }]}>
            Liability Coverage
          </Text>
          <Text style={[textStyles.buttonSmall, { color: colors.text.primary }]}>
            {formatCurrency(plan.liabilityCoverage)}
          </Text>
        </View>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={palette.success[600]}
              style={styles.featureIcon}
            />
            <Text
              style={[textStyles.body2, { color: colors.text.secondary, flex: 1 }]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing['4'],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    backgroundColor: 'transparent',
    marginBottom: spacing['3'],
    ...getShadow('sm'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  recommendedBadge: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    marginTop: spacing['4'],
    paddingTop: spacing['3'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  coverageContainer: {
    marginTop: spacing['3'],
    gap: spacing['2'],
  },
  coverageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuresContainer: {
    marginTop: spacing['3'],
    gap: spacing['2'],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2'],
  },
  featureIcon: {
    marginTop: 2,
  },
});
