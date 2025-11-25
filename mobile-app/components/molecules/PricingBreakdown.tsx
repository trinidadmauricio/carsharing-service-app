/**
 * PricingBreakdown Component
 * Displays detailed pricing breakdown for booking
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { palette, spacing } from '@/theme';

export interface PricingBreakdownProps {
  dailyRate: number;
  tripDays: number;
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  protectionPlanPrice?: number;
  protectionPlanName?: string;
  serviceFee: number;
  total: number;
  showDetails?: boolean;
}

export const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  dailyRate,
  tripDays,
  subtotal,
  discount = 0,
  discountPercentage,
  protectionPlanPrice = 0,
  protectionPlanName,
  serviceFee,
  total,
  showDetails = true,
}) => {
  return (
    <Card variant="outlined" style={styles.container}>
      {/* Base Rate */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text variant="body2" style={styles.label}>
            ${dailyRate.toFixed(2)} × {tripDays} {tripDays === 1 ? 'day' : 'days'}
          </Text>
        </View>
        <Text variant="body2" style={styles.value}>
          ${subtotal.toFixed(2)}
        </Text>
      </View>

      {/* Discount */}
      {discount > 0 && discountPercentage && (
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text variant="body2" style={styles.discountLabel}>
              {tripDays >= 30 ? 'Monthly' : 'Weekly'} discount ({discountPercentage}%)
            </Text>
          </View>
          <Text variant="body2" style={styles.discountValue}>
            -${discount.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Protection Plan */}
      {protectionPlanPrice > 0 && (
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text variant="body2" style={styles.label}>
              {protectionPlanName || 'Protection plan'}
            </Text>
            <Text variant="caption" style={styles.sublabel}>
              ${protectionPlanPrice.toFixed(2)} × {tripDays} {tripDays === 1 ? 'day' : 'days'}
            </Text>
          </View>
          <Text variant="body2" style={styles.value}>
            ${(protectionPlanPrice * tripDays).toFixed(2)}
          </Text>
        </View>
      )}

      {/* Service Fee */}
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <View style={styles.labelWithIcon}>
            <Text variant="body2" style={styles.label}>
              Service fee
            </Text>
            <Ionicons name="information-circle-outline" size={16} color={palette.gray[400]} />
          </View>
        </View>
        <Text variant="body2" style={styles.value}>
          ${serviceFee.toFixed(2)}
        </Text>
      </View>

      <Divider style={styles.divider} />

      {/* Total */}
      <View style={styles.row}>
        <Text variant="h4" style={styles.totalLabel}>
          Total
        </Text>
        <Text variant="h3" style={styles.totalValue}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {showDetails && (
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={16} color={palette.primary[500]} />
          <Text variant="caption" style={styles.infoText}>
            You won't be charged until your booking is confirmed by the host
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing['4'],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['3'],
  },
  labelContainer: {
    flex: 1,
    marginRight: spacing['3'],
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  label: {
    color: palette.gray[700],
  },
  sublabel: {
    color: palette.gray[500],
    marginTop: spacing['0.5'],
  },
  value: {
    fontWeight: '500',
    color: palette.gray[900],
  },
  discountLabel: {
    color: palette.green[600],
    fontWeight: '500',
  },
  discountValue: {
    fontWeight: '600',
    color: palette.green[600],
  },
  divider: {
    marginBottom: spacing['3'],
  },
  totalLabel: {
    fontWeight: '700',
  },
  totalValue: {
    fontWeight: '700',
    color: palette.primary[600],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary[50],
    borderRadius: 8,
    padding: spacing['2'],
    marginTop: spacing['3'],
    gap: spacing['2'],
  },
  infoText: {
    flex: 1,
    color: palette.primary[700],
  },
});
