/**
 * Host Onboarding - Requirements Page
 * Shows requirements to become a host
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';
import type { HostRequirement } from '@/types/host';

// Requirements data
const REQUIREMENTS: HostRequirement[] = [
  {
    id: 'age',
    title: 'Be at Least 21 Years Old',
    description: 'You must be 21+ to list a vehicle on our platform',
    required: true,
    completed: false,
    icon: 'person-outline',
  },
  {
    id: 'license',
    title: 'Valid Driver License',
    description: 'Hold a valid driver license in El Salvador',
    required: true,
    completed: false,
    icon: 'card-outline',
  },
  {
    id: 'vehicle',
    title: 'Vehicle Ownership',
    description: 'Own the vehicle or have written permission from the owner',
    required: true,
    completed: false,
    icon: 'document-text-outline',
  },
  {
    id: 'insurance',
    title: 'Personal Auto Insurance',
    description: 'Maintain active personal auto insurance on the vehicle',
    required: true,
    completed: false,
    icon: 'shield-outline',
  },
  {
    id: 'year',
    title: 'Vehicle Year 2010 or Newer',
    description: 'Vehicle must be model year 2010 or newer',
    required: true,
    completed: false,
    icon: 'calendar-outline',
  },
  {
    id: 'condition',
    title: 'Good Condition',
    description: 'Vehicle must be in good working condition with no major damage',
    required: true,
    completed: false,
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'registration',
    title: 'Valid Registration',
    description: 'Vehicle must have current registration and plates',
    required: true,
    completed: false,
    icon: 'newspaper-outline',
  },
  {
    id: 'bank',
    title: 'Bank Account',
    description: 'Have a bank account to receive payouts',
    required: true,
    completed: false,
    icon: 'wallet-outline',
  },
];

export default function HostOnboardingRequirementsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleContinue = (): void => {
    router.push('/(host)/onboarding/documents' as any);
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Requirements',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: spacing['4'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" style={{ color: colors.text.primary }}>
            Host Requirements
          </Text>
          <Text
            variant="body2"
            style={{ color: colors.text.secondary, marginTop: spacing['2'] }}
          >
            Make sure you meet these requirements before continuing
          </Text>
        </View>

        {/* Requirements List */}
        <View style={styles.requirementsList}>
          {REQUIREMENTS.map((req, index) => (
            <React.Fragment key={req.id}>
              <View style={styles.requirementItem}>
                <View
                  style={[
                    styles.requirementIcon,
                    { backgroundColor: palette.primary[100] },
                  ]}
                >
                  <Ionicons
                    name={req.icon as any}
                    size={24}
                    color={palette.primary[600]}
                  />
                </View>
                <View style={styles.requirementContent}>
                  <View style={styles.requirementHeader}>
                    <Text variant="body1" style={{ color: colors.text.primary, fontWeight: '600', flex: 1 }}>
                      {req.title}
                    </Text>
                    {req.required && (
                      <View style={[styles.requiredBadge, { backgroundColor: palette.error[100] }]}>
                        <Text variant="caption" style={{ color: palette.error[700], fontWeight: '600' }}>
                          Required
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    variant="body2"
                    style={{ color: colors.text.secondary, marginTop: spacing['1'] }}
                  >
                    {req.description}
                  </Text>
                </View>
              </View>
              {index < REQUIREMENTS.length - 1 && <Divider style={{ marginVertical: spacing['3'] }} />}
            </React.Fragment>
          ))}
        </View>

        {/* Important Notes */}
        <Card style={[styles.notesCard, { backgroundColor: palette.info[50] }]}>
          <View style={styles.notesHeader}>
            <Ionicons name="information-circle" size={20} color={palette.info[600]} />
            <Text
              variant="body2"
              style={{
                color: palette.info[900],
                fontWeight: '600',
                marginLeft: spacing['2'],
              }}
            >
              Important to Know
            </Text>
          </View>
          <Text
            variant="caption"
            style={{
              color: palette.info[800],
              marginTop: spacing['2'],
              lineHeight: 18,
            }}
          >
            • You'll need to upload photos of your driver's license, vehicle registration, and insurance during the next step{'\n'}
            • All documents will be verified before you can list your vehicle{'\n'}
            • You can save your progress and come back later
          </Text>
        </Card>

        {/* Terms and Conditions */}
        <Card
          style={styles.termsCard}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={styles.termsContent}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: acceptedTerms ? palette.primary[500] : colors.border.default,
                  backgroundColor: acceptedTerms ? palette.primary[500] : 'transparent',
                },
              ]}
            >
              {acceptedTerms && (
                <Ionicons name="checkmark" size={16} color="#FFF" />
              )}
            </View>
            <Text variant="body2" style={{ color: colors.text.primary, flex: 1, marginLeft: spacing['3'] }}>
              I meet all the requirements and agree to the{' '}
              <Text variant="body2" style={{ color: palette.primary[600], fontWeight: '600' }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text variant="body2" style={{ color: palette.primary[600], fontWeight: '600' }}>
                Host Agreement
              </Text>
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.default,
            paddingBottom: insets.bottom + spacing['4'],
          },
        ]}
      >
        <Button
          variant="primary"
          size="lg"
          onPress={handleContinue}
          disabled={!acceptedTerms}
          style={styles.ctaButton}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['6'],
  },
  header: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
  },
  requirementsList: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  requirementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementContent: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  requiredBadge: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: 4,
  },
  notesCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    marginBottom: spacing['4'],
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
  },
  termsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCTA: {
    borderTopWidth: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  ctaButton: {
    width: '100%',
  },
});
