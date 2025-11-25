/**
 * Browse Screen (Home)
 * Main vehicle search and discovery screen
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { VehicleCard, VehicleCardSkeleton } from '@/components/molecules/VehicleCard';
import { FiltersSheet, FiltersSheetRef } from '@/components/molecules/FiltersSheet';
import { MapWithVehicles } from '@/components/organisms/MapWithVehicles';
import { useThemeColors, palette } from '@/theme';
import { spacing, borderRadius } from '@/theme/spacing';
import { useVehicleSearch, useLocation } from '@/hooks';
import type { VehicleListItem } from '@/types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAP_HEIGHT = SCREEN_HEIGHT * 0.35; // 35% of screen

type ViewMode = 'list' | 'map';

export default function BrowseScreen(): React.ReactElement {
  const colors = useThemeColors();
  const filtersSheetRef = useRef<FiltersSheetRef>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Get user location
  const { coordinates, isLoading: locationLoading } = useLocation();

  // Search vehicles with initial criteria
  const {
    vehicles,
    totalCount,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    criteria,
    setCriteria,
    setLocation,
    resetFilters,
  } = useVehicleSearch({
    initialCriteria: {
      location: {
        coordinates: { latitude: 13.6929, longitude: -89.2182 }, // San Salvador default
      },
      maxDistance: 25,
      dateRange: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      },
      sortBy: 'recommended',
    },
  });

  // Debug logging
  React.useEffect(() => {
    console.log('[Browse] Search state:', {
      vehiclesCount: vehicles.length,
      totalCount,
      isLoading,
      isError,
      error: error?.message,
      coordinates,
      locationLoading,
    });
  }, [vehicles.length, totalCount, isLoading, isError, error, coordinates, locationLoading]);

  // Update search location when user location is available
  React.useEffect(() => {
    if (coordinates && !locationLoading) {
      setLocation(coordinates);
    }
  }, [coordinates, locationLoading, setLocation]);

  // Handle vehicle selection
  const handleVehiclePress = (vehicleId: string): void => {
    router.push(`/vehicle/${vehicleId}`);
  };

  // Handle map vehicle selection
  const handleVehicleSelect = (vehicle: VehicleListItem): void => {
    handleVehiclePress(vehicle.id);
  };

  // Toggle view mode
  const handleToggleView = (): void => {
    setViewMode((prev) => (prev === 'list' ? 'map' : 'list'));
  };

  // Handle filter actions
  const handleFiltersOpen = (): void => {
    filtersSheetRef.current?.open();
  };

  const handleFiltersApply = (): void => {
    filtersSheetRef.current?.close();
  };

  const handleFiltersReset = (): void => {
    resetFilters();
  };

  // Render vehicle card
  const renderVehicleCard = ({ item }: { item: VehicleListItem }): React.ReactElement => (
    <VehicleCard
      vehicle={item}
      onPress={() => handleVehiclePress(item.id)}
      style={styles.vehicleCard}
    />
  );

  // Render loading skeleton
  const renderSkeleton = (): React.ReactElement => (
    <View style={styles.skeletonContainer}>
      <VehicleCardSkeleton />
      <VehicleCardSkeleton />
      <VehicleCardSkeleton />
    </View>
  );

  // Render empty state
  const renderEmpty = (): React.ReactElement => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color={colors.text.tertiary} />
      <Text variant="h3" style={[styles.emptyTitle, { color: colors.text.primary }]}>
        No vehicles found
      </Text>
      <Text variant="body1" style={[styles.emptyText, { color: colors.text.secondary }]}>
        Try adjusting your filters or search area
      </Text>
      <Button
        variant="outline"
        size="md"
        onPress={handleFiltersOpen}
        style={styles.emptyButton}
      >
        Adjust Filters
      </Button>
    </View>
  );

  // Render error state
  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={palette.red[500]} />
          <Text variant="h3" style={[styles.errorTitle, { color: colors.text.primary }]}>
            Something went wrong
          </Text>
          <Text variant="body1" style={[styles.errorText, { color: colors.text.secondary }]}>
            {error instanceof Error ? error.message : 'Unable to load vehicles'}
          </Text>
          <Button variant="primary" size="md" onPress={() => refetch()}>
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.default }]}>
        <View style={styles.headerLeft}>
          <Text variant="h2" style={{ color: colors.text.primary }}>
            Browse
          </Text>
          <Text variant="caption" style={{ color: colors.text.tertiary }}>
            {vehicles.length} vehicles nearby
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* View mode toggle */}
          <Pressable
            onPress={handleToggleView}
            style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
            accessibilityLabel={`Switch to ${viewMode === 'list' ? 'map' : 'list'} view`}
          >
            <Ionicons
              name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
              size={20}
              color={colors.text.primary}
            />
          </Pressable>

          {/* Filters button */}
          <Pressable
            onPress={handleFiltersOpen}
            style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
            accessibilityLabel="Open filters"
          >
            <Ionicons name="options-outline" size={20} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>

      {/* Map View (when active) */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          <MapWithVehicles
            vehicles={vehicles}
            userLocation={coordinates}
            initialRegion={{
              latitude: criteria.location.coordinates.latitude,
              longitude: criteria.location.coordinates.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onVehicleSelect={handleVehicleSelect}
            showUserLocation={true}
            isLoading={isLoading}
          />
        </View>
      )}

      {/* Vehicle List */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            vehicles.length === 0 && styles.listContainerEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={palette.primary[500]} />
              </View>
            ) : null
          }
        />
      )}

      {/* Filters Bottom Sheet */}
      <FiltersSheet
        ref={filtersSheetRef}
        criteria={criteria}
        onCriteriaChange={setCriteria}
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
        resultsCount={totalCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing['2'],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: MAP_HEIGHT,
  },
  listContainer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['6'],
  },
  listContainerEmpty: {
    flexGrow: 1,
  },
  vehicleCard: {
    marginBottom: spacing['4'],
  },
  skeletonContainer: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    gap: spacing['4'],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
  },
  emptyTitle: {
    marginTop: spacing['4'],
    textAlign: 'center',
  },
  emptyText: {
    marginTop: spacing['2'],
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: spacing['6'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
  },
  errorTitle: {
    marginTop: spacing['4'],
    textAlign: 'center',
  },
  errorText: {
    marginTop: spacing['2'],
    marginBottom: spacing['6'],
    textAlign: 'center',
  },
  loadingMore: {
    paddingVertical: spacing['4'],
    alignItems: 'center',
  },
});
