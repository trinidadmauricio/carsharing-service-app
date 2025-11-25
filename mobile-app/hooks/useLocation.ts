/**
 * useLocation Hook
 * Get and watch user's current location
 */

import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinates } from '@/types';

interface LocationState {
  coordinates: Coordinates | null;
  address: string | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  watchPosition?: boolean;
  requestOnMount?: boolean;
}

interface UseLocationReturn extends LocationState {
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Coordinates | null>;
  reverseGeocode: (coordinates: Coordinates) => Promise<string | null>;
}

// Default location: San Salvador, El Salvador
export const DEFAULT_LOCATION: Coordinates = {
  latitude: 13.6929,
  longitude: -89.2182,
};

export function useLocation(options: UseLocationOptions = {}): UseLocationReturn {
  const {
    enableHighAccuracy = false,
    watchPosition = false,
    requestOnMount = true,
  } = options;

  const [state, setState] = useState<LocationState>({
    coordinates: null,
    address: null,
    city: null,
    isLoading: true,
    error: null,
    permissionStatus: null,
  });

  // Request location permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setState((prev) => ({ ...prev, permissionStatus: status }));
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Permission request failed';
      setState((prev) => ({ ...prev, error: message }));
      return false;
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check permission first
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        const granted = await requestPermission();
        if (!granted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Location permission denied',
          }));
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: enableHighAccuracy
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
      });

      const coordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Reverse geocode to get address
      let address: string | null = null;
      let city: string | null = null;

      try {
        const [result] = await Location.reverseGeocodeAsync(coordinates);
        if (result) {
          city = result.city || result.subregion || null;
          address = [result.street, result.city, result.region]
            .filter(Boolean)
            .join(', ');
        }
      } catch {
        // Geocoding failed, continue without address
      }

      setState((prev) => ({
        ...prev,
        coordinates,
        address,
        city,
        isLoading: false,
        error: null,
      }));

      return coordinates;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      return null;
    }
  }, [enableHighAccuracy, requestPermission]);

  // Reverse geocode coordinates to address
  const reverseGeocode = useCallback(
    async (coordinates: Coordinates): Promise<string | null> => {
      try {
        const [result] = await Location.reverseGeocodeAsync(coordinates);
        if (result) {
          return [result.street, result.city, result.region]
            .filter(Boolean)
            .join(', ');
        }
        return null;
      } catch {
        return null;
      }
    },
    []
  );

  // Watch position effect
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      if (!watchPosition) return;

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: enableHighAccuracy
            ? Location.Accuracy.High
            : Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          setState((prev) => ({
            ...prev,
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          }));
        }
      );
    };

    startWatching();

    return () => {
      subscription?.remove();
    };
  }, [watchPosition, enableHighAccuracy]);

  // Request location on mount
  useEffect(() => {
    if (requestOnMount) {
      getCurrentLocation();
    }
  }, [requestOnMount, getCurrentLocation]);

  return {
    ...state,
    requestPermission,
    getCurrentLocation,
    reverseGeocode,
  };
}

/**
 * Get formatted distance string
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) {
    return 'Nearby';
  }
  if (miles < 1) {
    return `${Math.round(miles * 10) / 10} mi`;
  }
  return `${Math.round(miles)} mi`;
}
