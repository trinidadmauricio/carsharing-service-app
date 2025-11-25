/**
 * useVehicleSearch Hook
 * TanStack Query hook for vehicle search with filtering, sorting, and pagination
 */

import { useCallback, useMemo, useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { svc } from '@/services';
import type {
  SearchCriteria,
  SearchResults,
  VehicleDetail,
  VehicleListItem,
  SearchSortBy,
  VehicleType,
  TransmissionType,
  FuelType,
  VehicleFeature,
  PriceRange,
  DateTimeRange,
  Coordinates,
  DEFAULT_SEARCH_CRITERIA,
} from '@/types';

// Query keys
export const vehicleKeys = {
  all: ['vehicles'] as const,
  search: (criteria: Partial<SearchCriteria>) => [...vehicleKeys.all, 'search', criteria] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
  availability: (id: string, start: string, end: string) =>
    [...vehicleKeys.all, 'availability', id, start, end] as const,
  favorites: () => [...vehicleKeys.all, 'favorites'] as const,
  recentlyViewed: () => [...vehicleKeys.all, 'recently-viewed'] as const,
  similar: (id: string) => [...vehicleKeys.all, 'similar', id] as const,
  popular: (lat: number, lng: number) => [...vehicleKeys.all, 'popular', lat, lng] as const,
};

// Default location: San Salvador, El Salvador
const DEFAULT_LOCATION: Coordinates = {
  latitude: 13.6929,
  longitude: -89.2182,
};

interface UseVehicleSearchOptions {
  initialCriteria?: Partial<SearchCriteria>;
  pageSize?: number;
  enabled?: boolean;
}

interface UseVehicleSearchReturn {
  // Data
  vehicles: VehicleListItem[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;

  // Criteria state
  criteria: SearchCriteria;

  // Actions
  setCriteria: (criteria: Partial<SearchCriteria>) => void;
  setLocation: (coordinates: Coordinates, address?: string) => void;
  setDateRange: (dateRange: DateTimeRange) => void;
  setPriceRange: (priceRange: PriceRange | undefined) => void;
  setVehicleTypes: (types: VehicleType[]) => void;
  setTransmission: (transmission: TransmissionType[]) => void;
  setFeatures: (features: VehicleFeature[]) => void;
  setSortBy: (sortBy: SearchSortBy) => void;
  setInstantBookOnly: (enabled: boolean) => void;
  setSuperHostOnly: (enabled: boolean) => void;
  setMinHostRating: (rating: number | undefined) => void;
  setMaxDistance: (distance: number) => void;
  resetFilters: () => void;
  fetchNextPage: () => void;
  refetch: () => void;
}

/**
 * Hook for vehicle search with filtering and infinite scroll pagination
 */
export function useVehicleSearch(
  options: UseVehicleSearchOptions = {}
): UseVehicleSearchReturn {
  const { initialCriteria, pageSize = 10, enabled = true } = options;

  // Default date range: now to 2 hours from now
  const defaultDateRange: DateTimeRange = {
    start: new Date().toISOString(),
    end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  };

  // Search criteria state
  const [criteria, setCriteriaState] = useState<SearchCriteria>({
    location: {
      coordinates: DEFAULT_LOCATION,
    },
    maxDistance: 25,
    dateRange: defaultDateRange,
    sortBy: 'recommended',
    ...initialCriteria,
  });

  // Infinite query for paginated results
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: vehicleKeys.search(criteria),
    queryFn: async ({ pageParam = 1 }) => {
      return svc.vehicles.search({
        criteria,
        page: pageParam,
        pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten paginated results
  const vehicles = useMemo(() => {
    return data?.pages.flatMap((page) => page.vehicles) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Action handlers
  const setCriteria = useCallback((newCriteria: Partial<SearchCriteria>) => {
    setCriteriaState((prev) => ({ ...prev, ...newCriteria }));
  }, []);

  const setLocation = useCallback(
    (coordinates: Coordinates, address?: string) => {
      setCriteriaState((prev) => ({
        ...prev,
        location: { coordinates, address },
      }));
    },
    []
  );

  const setDateRange = useCallback((dateRange: DateTimeRange) => {
    setCriteriaState((prev) => ({ ...prev, dateRange }));
  }, []);

  const setPriceRange = useCallback((priceRange: PriceRange | undefined) => {
    setCriteriaState((prev) => ({ ...prev, priceRange }));
  }, []);

  const setVehicleTypes = useCallback((vehicleTypes: VehicleType[]) => {
    setCriteriaState((prev) => ({
      ...prev,
      vehicleTypes: vehicleTypes.length > 0 ? vehicleTypes : undefined,
    }));
  }, []);

  const setTransmission = useCallback((transmission: TransmissionType[]) => {
    setCriteriaState((prev) => ({
      ...prev,
      transmission: transmission.length > 0 ? transmission : undefined,
    }));
  }, []);

  const setFeatures = useCallback((features: VehicleFeature[]) => {
    setCriteriaState((prev) => ({
      ...prev,
      features: features.length > 0 ? features : undefined,
    }));
  }, []);

  const setSortBy = useCallback((sortBy: SearchSortBy) => {
    setCriteriaState((prev) => ({ ...prev, sortBy }));
  }, []);

  const setInstantBookOnly = useCallback((instantBookOnly: boolean) => {
    setCriteriaState((prev) => ({ ...prev, instantBookOnly }));
  }, []);

  const setSuperHostOnly = useCallback((superHostOnly: boolean) => {
    setCriteriaState((prev) => ({ ...prev, superHostOnly }));
  }, []);

  const setMinHostRating = useCallback((minHostRating: number | undefined) => {
    setCriteriaState((prev) => ({ ...prev, minHostRating }));
  }, []);

  const setMaxDistance = useCallback((maxDistance: number) => {
    setCriteriaState((prev) => ({ ...prev, maxDistance }));
  }, []);

  const resetFilters = useCallback(() => {
    setCriteriaState((prev) => ({
      location: prev.location,
      dateRange: prev.dateRange,
      maxDistance: 25,
      sortBy: 'recommended',
    }));
  }, []);

  return {
    vehicles,
    totalCount,
    isLoading,
    isError,
    error: error as Error | null,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    criteria,
    setCriteria,
    setLocation,
    setDateRange,
    setPriceRange,
    setVehicleTypes,
    setTransmission,
    setFeatures,
    setSortBy,
    setInstantBookOnly,
    setSuperHostOnly,
    setMinHostRating,
    setMaxDistance,
    resetFilters,
    fetchNextPage,
    refetch,
  };
}

/**
 * Hook for fetching a single vehicle detail
 */
export function useVehicleDetail(vehicleId: string, options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: vehicleKeys.detail(vehicleId),
    queryFn: async () => {
      // Track the view
      svc.vehicles.trackView(vehicleId);
      return svc.vehicles.getById(vehicleId);
    },
    enabled: enabled && !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
}

/**
 * Hook for vehicle availability
 */
export function useVehicleAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: vehicleKeys.availability(vehicleId, startDate, endDate),
    queryFn: () =>
      svc.vehicles.getAvailability({ vehicleId, startDate, endDate }),
    enabled: enabled && !!vehicleId && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for user favorites
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: vehicleKeys.favorites(),
    queryFn: () => svc.vehicles.getFavorites(),
    staleTime: 5 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: (vehicleId: string) => svc.vehicles.addToFavorites(vehicleId),
    onMutate: async (vehicleId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: vehicleKeys.favorites() });
      const previous = queryClient.getQueryData(vehicleKeys.favorites());

      // Update search results optimistically
      queryClient.setQueriesData(
        { queryKey: vehicleKeys.all },
        (old: any) => {
          if (!old) return old;
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map((page: SearchResults) => ({
                ...page,
                vehicles: page.vehicles.map((v) =>
                  v.id === vehicleId ? { ...v, isFavorite: true } : v
                ),
              })),
            };
          }
          return old;
        }
      );

      return { previous };
    },
    onError: (_err, _vehicleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vehicleKeys.favorites(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.favorites() });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (vehicleId: string) =>
      svc.vehicles.removeFromFavorites(vehicleId),
    onMutate: async (vehicleId) => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.favorites() });
      const previous = queryClient.getQueryData(vehicleKeys.favorites());

      // Update search results optimistically
      queryClient.setQueriesData(
        { queryKey: vehicleKeys.all },
        (old: any) => {
          if (!old) return old;
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map((page: SearchResults) => ({
                ...page,
                vehicles: page.vehicles.map((v) =>
                  v.id === vehicleId ? { ...v, isFavorite: false } : v
                ),
              })),
            };
          }
          return old;
        }
      );

      return { previous };
    },
    onError: (_err, _vehicleId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vehicleKeys.favorites(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.favorites() });
    },
  });

  const toggleFavorite = useCallback(
    (vehicleId: string, isFavorite: boolean) => {
      if (isFavorite) {
        removeMutation.mutate(vehicleId);
      } else {
        addMutation.mutate(vehicleId);
      }
    },
    [addMutation, removeMutation]
  );

  return {
    favorites: query.data?.vehicles ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    toggleFavorite,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
}

/**
 * Hook for recently viewed vehicles
 */
export function useRecentlyViewed() {
  return useQuery({
    queryKey: vehicleKeys.recentlyViewed(),
    queryFn: () => svc.vehicles.getRecentlyViewed(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for similar vehicles
 */
export function useSimilarVehicles(vehicleId: string, limit = 4) {
  return useQuery({
    queryKey: vehicleKeys.similar(vehicleId),
    queryFn: () => svc.vehicles.getSimilar(vehicleId, limit),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for popular vehicles in area
 */
export function usePopularVehicles(
  latitude: number,
  longitude: number,
  limit = 6
) {
  return useQuery({
    queryKey: vehicleKeys.popular(latitude, longitude),
    queryFn: () => svc.vehicles.getPopularInArea(latitude, longitude, limit),
    enabled: !!latitude && !!longitude,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
