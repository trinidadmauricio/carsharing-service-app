/**
 * ProgressBar Component
 * Visual progress indicator with multiple variants
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  progress: number; // 0 to 100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  labelPosition?: 'top' | 'right' | 'inside';
  animated?: boolean;
  style?: ViewStyle;
  trackColor?: string;
  fillColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  animated = true,
  style,
  trackColor,
  fillColor,
}) => {
  const colors = useThemeColors();
  const animatedProgress = useSharedValue(0);

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(clampedProgress, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = clampedProgress;
    }
  }, [clampedProgress, animated, animatedProgress]);

  const getVariantColor = (): string => {
    if (fillColor) return fillColor;

    switch (variant) {
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      default:
        return colors.interactive.primary;
    }
  };

  const getSizeStyles = (): { height: number; labelStyle: object } => {
    switch (size) {
      case 'sm':
        return {
          height: 4,
          labelStyle: textStyles.caption,
        };
      case 'lg':
        return {
          height: 12,
          labelStyle: textStyles.labelMedium,
        };
      default:
        return {
          height: 8,
          labelStyle: textStyles.labelSmall,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const barColor = getVariantColor();
  const bgColor = trackColor ?? colors.background.tertiary;

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  const renderLabel = (): React.ReactNode => {
    if (!showLabel) return null;

    return (
      <Text
        style={[
          sizeStyles.labelStyle,
          styles.label,
          { color: colors.text.secondary },
          labelPosition === 'inside' && {
            color: colors.text.inverse,
            position: 'absolute',
            right: spacing['2'],
          },
        ]}
      >
        {Math.round(clampedProgress)}%
      </Text>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && labelPosition === 'top' && (
        <View style={styles.topLabelContainer}>{renderLabel()}</View>
      )}

      <View style={styles.barContainer}>
        <View
          style={[
            styles.track,
            {
              height: sizeStyles.height,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                height: sizeStyles.height,
                backgroundColor: barColor,
              },
              animatedFillStyle,
            ]}
          />
          {showLabel && labelPosition === 'inside' && size === 'lg' && renderLabel()}
        </View>

        {showLabel && labelPosition === 'right' && (
          <View style={styles.rightLabelContainer}>{renderLabel()}</View>
        )}
      </View>
    </View>
  );
};

// Step Progress for multi-step forms
interface StepProgressProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  style?: ViewStyle;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  labels,
  style,
}) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.stepContainer, style]}>
      <View style={styles.stepsRow}>
        {Array.from({ length: steps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step circle */}
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isCompleted || isCurrent
                      ? colors.interactive.primary
                      : colors.background.tertiary,
                    borderColor: isCurrent
                      ? colors.interactive.primary
                      : 'transparent',
                  },
                ]}
                accessibilityLabel={`Step ${index + 1}${isCompleted ? ' completed' : isCurrent ? ' current' : ''}`}
              >
                {isCompleted ? (
                  <Text style={[styles.stepCheck, { color: colors.text.inverse }]}>
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color: isCurrent
                          ? colors.text.inverse
                          : colors.text.tertiary,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connector line */}
              {index < steps - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    {
                      backgroundColor: isCompleted
                        ? colors.interactive.primary
                        : colors.background.tertiary,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {labels && labels.length === steps && (
        <View style={styles.labelsRow}>
          {labels.map((label, index) => (
            <Text
              key={index}
              style={[
                styles.stepLabel,
                textStyles.caption,
                {
                  color:
                    index <= currentStep
                      ? colors.text.primary
                      : colors.text.tertiary,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    borderRadius: borderRadius.full,
  },
  label: {},
  topLabelContainer: {
    marginBottom: spacing['1'],
    alignItems: 'flex-end',
  },
  rightLabelContainer: {
    marginLeft: spacing['2'],
    minWidth: 40,
    alignItems: 'flex-end',
  },
  // Step Progress styles
  stepContainer: {
    width: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepNumber: {
    ...textStyles.labelSmall,
  },
  stepCheck: {
    ...textStyles.labelSmall,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    maxWidth: 60,
    marginHorizontal: spacing['2'],
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing['2'],
  },
  stepLabel: {
    flex: 1,
    textAlign: 'center',
  },
});
