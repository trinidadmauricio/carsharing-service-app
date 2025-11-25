/**
 * FiltersSheet Component
 * Bottom sheet for vehicle search filters
 */

import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Chip, ChipGroup } from '@/components/atoms/Chip';
import { useThemeColors, palette, spacing, borderRadius } from '@/theme';
import type {
  SearchCriteria,
  SearchSortBy,
  VehicleType,
  TransmissionType,
  VehicleFeature,
  PriceRange,
  SORT_OPTIONS,
  VEHICLE_TYPE_DISPLAY,
  FEATURE_DISPLAY,
} from '@/types';

export interface FiltersSheetRef {
  open: () => void;
  close: () => void;
}

interface FiltersSheetProps {
  criteria: SearchCriteria;
  onCriteriaChange: (criteria: Partial<SearchCriteria>) => void;
  onApply: () => void;
  onReset: () => void;
  resultsCount?: number;
}

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'sports', label: 'Sports' },
  { value: 'minivan', label: 'Minivan' },
  { value: 'truck', label: 'Truck' },
  { value: 'electric', label: 'Electric' },
];

const TRANSMISSION_TYPES: { value: TransmissionType; label: string }[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

const FEATURES: { value: VehicleFeature; label: string; icon: string }[] = [
  { value: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth' },
  { value: 'gps', label: 'GPS', icon: 'navigate' },
  { value: 'backup_camera', label: 'Backup Camera', icon: 'videocam' },
  { value: 'apple_carplay', label: 'Apple CarPlay', icon: 'logo-apple' },
  { value: 'android_auto', label: 'Android Auto', icon: 'logo-android' },
  { value: 'sunroof', label: 'Sunroof', icon: 'sunny' },
  { value: 'heated_seats', label: 'Heated Seats', icon: 'flame' },
  { value: 'child_seat', label: 'Child Seat', icon: 'person' },
];

const SORT_OPTIONS_LIST: { value: SearchSortBy; label: string; icon: string }[] = [
  { value: 'recommended', label: 'Recommended', icon: 'star' },
  { value: 'price_low_to_high', label: 'Price: Low to High', icon: 'arrow-up' },
  { value: 'price_high_to_low', label: 'Price: High to Low', icon: 'arrow-down' },
  { value: 'distance', label: 'Distance: Nearest', icon: 'location' },
  { value: 'rating', label: 'Rating: Highest', icon: 'thumbs-up' },
  { value: 'newest', label: 'Newest Listings', icon: 'time' },
];

export const FiltersSheet = forwardRef<FiltersSheetRef, FiltersSheetProps>(
  ({ criteria, onCriteriaChange, onApply, onReset, resultsCount }, ref) => {
    const colors = useThemeColors();
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Snap points
    const snapPoints = useMemo(() => ['75%', '95%'], []);

    // Expose methods
    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    // Backdrop
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    // Handle changes
    const handleVehicleTypeToggle = useCallback(
      (type: VehicleType) => {
        const current = criteria.vehicleTypes || [];
        const updated = current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type];
        onCriteriaChange({ vehicleTypes: updated.length > 0 ? updated : undefined });
      },
      [criteria.vehicleTypes, onCriteriaChange]
    );

    const handleTransmissionToggle = useCallback(
      (type: TransmissionType) => {
        const current = criteria.transmission || [];
        const updated = current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type];
        onCriteriaChange({ transmission: updated.length > 0 ? updated : undefined });
      },
      [criteria.transmission, onCriteriaChange]
    );

    const handleFeatureToggle = useCallback(
      (feature: VehicleFeature) => {
        const current = criteria.features || [];
        const updated = current.includes(feature)
          ? current.filter((f) => f !== feature)
          : [...current, feature];
        onCriteriaChange({ features: updated.length > 0 ? updated : undefined });
      },
      [criteria.features, onCriteriaChange]
    );

    const handlePriceChange = useCallback(
      (min: number, max: number) => {
        onCriteriaChange({
          priceRange: { min, max },
        });
      },
      [onCriteriaChange]
    );

    const handleSortChange = useCallback(
      (sortBy: SearchSortBy) => {
        onCriteriaChange({ sortBy });
      },
      [onCriteriaChange]
    );

    const handleInstantBookToggle = useCallback(() => {
      onCriteriaChange({ instantBookOnly: !criteria.instantBookOnly });
    }, [criteria.instantBookOnly, onCriteriaChange]);

    const handleSuperHostToggle = useCallback(() => {
      onCriteriaChange({ superHostOnly: !criteria.superHostOnly });
    }, [criteria.superHostOnly, onCriteriaChange]);

    const handleApply = useCallback(() => {
      onApply();
      bottomSheetRef.current?.close();
    }, [onApply]);

    // Count active filters
    const activeFilterCount = useMemo(() => {
      let count = 0;
      if (criteria.vehicleTypes?.length) count += criteria.vehicleTypes.length;
      if (criteria.transmission?.length) count += criteria.transmission.length;
      if (criteria.features?.length) count += criteria.features.length;
      if (criteria.priceRange) count += 1;
      if (criteria.instantBookOnly) count += 1;
      if (criteria.superHostOnly) count += 1;
      if (criteria.minHostRating) count += 1;
      return count;
    }, [criteria]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={[
          styles.background,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <BottomSheetView style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="h3">Filters</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterCount}>
                <Text variant="caption" style={styles.filterCountText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </View>
          <Pressable onPress={onReset}>
            <Text variant="body2" style={styles.clearText}>
              Clear all
            </Text>
          </Pressable>
        </BottomSheetView>

        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Sort By */}
          <FilterSection title="Sort by">
            <View style={styles.sortOptions}>
              {SORT_OPTIONS_LIST.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.sortOption,
                    criteria.sortBy === option.value && styles.sortOptionActive,
                  ]}
                  onPress={() => handleSortChange(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={
                      criteria.sortBy === option.value
                        ? palette.primary[600]
                        : palette.gray[600]
                    }
                  />
                  <Text
                    variant="body2"
                    style={[
                      styles.sortOptionText,
                      criteria.sortBy === option.value && styles.sortOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price per day">
            <View style={styles.priceContainer}>
              <View style={styles.priceLabels}>
                <Text variant="body2">
                  ${criteria.priceRange?.min || 0}
                </Text>
                <Text variant="body2">
                  ${criteria.priceRange?.max || 200}+
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={200}
                step={5}
                value={criteria.priceRange?.max || 200}
                onValueChange={(value) =>
                  handlePriceChange(criteria.priceRange?.min || 0, value)
                }
                minimumTrackTintColor={palette.primary[500]}
                maximumTrackTintColor={palette.gray[300]}
                thumbTintColor={palette.primary[500]}
              />
            </View>
          </FilterSection>

          {/* Vehicle Type */}
          <FilterSection title="Vehicle type">
            <View style={styles.chipContainer}>
              {VEHICLE_TYPES.map((type) => (
                <Chip
                  key={type.value}
                  label={type.label}
                  selected={criteria.vehicleTypes?.includes(type.value) || false}
                  onPress={() => handleVehicleTypeToggle(type.value)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Transmission */}
          <FilterSection title="Transmission">
            <View style={styles.chipContainer}>
              {TRANSMISSION_TYPES.map((type) => (
                <Chip
                  key={type.value}
                  label={type.label}
                  selected={criteria.transmission?.includes(type.value) || false}
                  onPress={() => handleTransmissionToggle(type.value)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Features */}
          <FilterSection title="Features">
            <View style={styles.chipContainer}>
              {FEATURES.map((feature) => (
                <Chip
                  key={feature.value}
                  label={feature.label}
                  leftIcon={
                    <Ionicons
                      name={feature.icon as any}
                      size={14}
                      color={
                        criteria.features?.includes(feature.value)
                          ? palette.primary[600]
                          : palette.gray[600]
                      }
                    />
                  }
                  selected={criteria.features?.includes(feature.value) || false}
                  onPress={() => handleFeatureToggle(feature.value)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Booking Options */}
          <FilterSection title="Booking options">
            <View style={styles.toggleContainer}>
              <ToggleOption
                label="Instant Book"
                description="Book without waiting for host approval"
                icon="flash"
                isOn={criteria.instantBookOnly || false}
                onToggle={handleInstantBookToggle}
              />
              <ToggleOption
                label="Superhost only"
                description="Only show vehicles from top-rated hosts"
                icon="ribbon"
                isOn={criteria.superHostOnly || false}
                onToggle={handleSuperHostToggle}
              />
            </View>
          </FilterSection>

          {/* Spacer for bottom button */}
          <View style={styles.bottomSpacer} />
        </BottomSheetScrollView>

        {/* Apply Button */}
        <View style={[styles.footer, { backgroundColor: colors.background.primary }]}>
          <Button onPress={handleApply} style={styles.applyButton}>
            {resultsCount !== undefined
              ? `Show ${resultsCount} vehicles`
              : 'Apply filters'}
          </Button>
        </View>
      </BottomSheet>
    );
  }
);

FiltersSheet.displayName = 'FiltersSheet';

// Filter section component
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text variant="h4" style={styles.sectionTitle}>
      {title}
    </Text>
    {children}
  </View>
);

// Toggle option component
interface ToggleOptionProps {
  label: string;
  description: string;
  icon: string;
  isOn: boolean;
  onToggle: () => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({
  label,
  description,
  icon,
  isOn,
  onToggle,
}) => (
  <Pressable style={styles.toggleOption} onPress={onToggle}>
    <View style={styles.toggleLeft}>
      <View
        style={[
          styles.toggleIcon,
          isOn && styles.toggleIconActive,
        ]}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isOn ? palette.primary[600] : palette.gray[500]}
        />
      </View>
      <View style={styles.toggleInfo}>
        <Text variant="body1" style={styles.toggleLabel}>
          {label}
        </Text>
        <Text variant="caption" style={styles.toggleDescription}>
          {description}
        </Text>
      </View>
    </View>
    <View
      style={[
        styles.toggleSwitch,
        isOn && styles.toggleSwitchOn,
      ]}
    >
      <View
        style={[
          styles.toggleKnob,
          isOn && styles.toggleKnobOn,
        ]}
      />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
  },
  handleIndicator: {
    backgroundColor: palette.gray[300],
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterCount: {
    marginLeft: spacing['2'],
    backgroundColor: palette.primary[500],
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.full,
  },
  filterCountText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clearText: {
    color: palette.primary[600],
  },
  content: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  section: {
    marginBottom: spacing['6'],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  sortOptions: {
    gap: spacing['2'],
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['3'],
    borderRadius: borderRadius.lg,
    backgroundColor: palette.gray[50],
    gap: spacing['2'],
  },
  sortOptionActive: {
    backgroundColor: palette.primary[50],
    borderWidth: 1,
    borderColor: palette.primary[500],
  },
  sortOptionText: {
    color: palette.gray[700],
  },
  sortOptionTextActive: {
    color: palette.primary[700],
    fontWeight: '600',
  },
  priceContainer: {
    paddingHorizontal: spacing['2'],
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['2'],
  },
  slider: {
    width: '100%',
    height: 40,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
  toggleContainer: {
    gap: spacing['3'],
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['3'],
    backgroundColor: palette.gray[50],
    borderRadius: borderRadius.lg,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: palette.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing['3'],
  },
  toggleIconActive: {
    backgroundColor: palette.primary[100],
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontWeight: '500',
    marginBottom: spacing['0.5'],
  },
  toggleDescription: {
    color: palette.gray[600],
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.gray[300],
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchOn: {
    backgroundColor: palette.primary[500],
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing['4'],
    paddingBottom: spacing['6'],
    borderTopWidth: 1,
    borderTopColor: palette.gray[200],
  },
  applyButton: {
    width: '100%',
  },
});

export default FiltersSheet;
