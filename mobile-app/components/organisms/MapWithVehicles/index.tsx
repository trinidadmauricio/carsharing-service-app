/**
 * MapWithVehicles Component
 * Interactive map displaying vehicle markers with clustering and selection
 */

import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
  MapMarker,
} from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';
import { useThemeColors, palette, spacing, borderRadius, shadows } from '@/theme';
import type { Coordinates, VehicleListItem, MapRegion } from '@/types';

// Default map region: San Salvador, El Salvador
export const DEFAULT_MAP_REGION: MapRegion = {
  latitude: 13.6929,
  longitude: -89.2182,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

interface MapWithVehiclesProps {
  vehicles: VehicleListItem[];
  userLocation?: Coordinates | null;
  initialRegion?: MapRegion;
  selectedVehicleId?: string | null;
  onVehicleSelect?: (vehicle: VehicleListItem) => void;
  onRegionChange?: (region: MapRegion) => void;
  onMapReady?: () => void;
  showUserLocation?: boolean;
  isLoading?: boolean;
  style?: object;
}

export const MapWithVehicles: React.FC<MapWithVehiclesProps> = ({
  vehicles,
  userLocation,
  initialRegion = DEFAULT_MAP_REGION,
  selectedVehicleId,
  onVehicleSelect,
  onRegionChange,
  onMapReady,
  showUserLocation = true,
  isLoading = false,
  style,
}) => {
  const colors = useThemeColors();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  // Center map on user location when available
  useEffect(() => {
    if (userLocation && mapReady && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  }, [userLocation, mapReady]);

  // Handle map ready
  const handleMapReady = useCallback(() => {
    setMapReady(true);
    onMapReady?.();
  }, [onMapReady]);

  // Handle region change
  const handleRegionChange = useCallback(
    (region: Region) => {
      onRegionChange?.({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    },
    [onRegionChange]
  );

  // Handle marker press
  const handleMarkerPress = useCallback(
    (vehicle: VehicleListItem) => {
      onVehicleSelect?.(vehicle);

      // Animate to vehicle location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...vehicle.location.coordinates,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          300
        );
      }
    },
    [onVehicleSelect]
  );

  // Fit map to show all vehicles
  const fitToVehicles = useCallback(() => {
    if (mapRef.current && vehicles.length > 0) {
      const coordinates = vehicles.map((v) => ({
        latitude: v.location.coordinates.latitude,
        longitude: v.location.coordinates.longitude,
      }));

      if (userLocation) {
        coordinates.push({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  }, [vehicles, userLocation]);

  // Map style for dark mode
  const mapStyle = useMemo(() => {
    // Return custom map style for dark mode if needed
    return undefined;
  }, []);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        customMapStyle={mapStyle}
        onMapReady={handleMapReady}
        onRegionChangeComplete={handleRegionChange}
        accessibilityLabel="Map showing available vehicles"
      >
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicle.id === selectedVehicleId}
            onPress={() => handleMarkerPress(vehicle)}
          />
        ))}
      </MapView>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: colors.background.primary },
            ]}
          >
            <ActivityIndicator size="small" color={palette.primary[500]} />
            <Text variant="body2" style={styles.loadingText}>
              Loading vehicles...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Custom vehicle marker component
interface VehicleMarkerProps {
  vehicle: VehicleListItem;
  isSelected: boolean;
  onPress: () => void;
}

const VehicleMarker: React.FC<VehicleMarkerProps> = ({
  vehicle,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.2 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker
      coordinate={{
        latitude: vehicle.location.coordinates.latitude,
        longitude: vehicle.location.coordinates.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
      accessibilityLabel={`${vehicle.make} ${vehicle.model}, $${vehicle.dailyRate} per day`}
    >
      <Animated.View style={animatedStyle}>
        <PriceMarker
          price={vehicle.dailyRate}
          isInstantBook={vehicle.instantBookEnabled}
          isSelected={isSelected}
        />
      </Animated.View>
    </Marker>
  );
};

// Price marker bubble
interface PriceMarkerProps {
  price: number;
  isInstantBook: boolean;
  isSelected: boolean;
}

const PriceMarker: React.FC<PriceMarkerProps> = ({
  price,
  isInstantBook,
  isSelected,
}) => {
  const backgroundColor = isSelected
    ? palette.primary[600]
    : isInstantBook
    ? palette.primary[500]
    : palette.gray[800];

  return (
    <View style={styles.markerContainer}>
      <View
        style={[
          styles.markerBubble,
          { backgroundColor },
          isSelected && styles.markerBubbleSelected,
        ]}
      >
        <Text variant="caption" style={styles.markerPrice}>
          ${price}
        </Text>
        {isInstantBook && (
          <View style={styles.instantBadge}>
            <Text style={styles.instantIcon}>{"⚡"}</Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.markerArrow,
          { borderTopColor: backgroundColor },
        ]}
      />
    </View>
  );
};

// Cluster marker for zoomed out view
interface ClusterMarkerProps {
  count: number;
  coordinate: Coordinates;
  onPress: () => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  count,
  coordinate,
  onPress,
}) => {
  return (
    <Marker
      coordinate={{
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.clusterMarker}>
        <Text variant="caption" style={styles.clusterText}>
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    position: 'absolute',
    top: spacing['4'],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  loadingText: {
    marginLeft: spacing['2'],
    color: palette.gray[600],
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1.5'],
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  markerBubbleSelected: {
    ...shadows.lg,
  },
  markerPrice: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  instantBadge: {
    marginLeft: spacing['1'],
  },
  instantIcon: {
    fontSize: 10,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  clusterMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  clusterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default MapWithVehicles;
