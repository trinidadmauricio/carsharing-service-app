/**
 * Search Types
 * Interfaces for vehicle search, filtering, and sorting
 */

import type {
  Coordinates,
  FuelType,
  TransmissionType,
  VehicleFeature,
  VehicleListItem,
  VehicleType,
} from './vehicle';

/**
 * Sort options for search results
 */
export type SearchSortBy =
  | 'recommended'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'distance'
  | 'rating'
  | 'newest';

/**
 * Price range filter
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Date/time range for booking
 */
export interface DateTimeRange {
  start: string; // ISO 8601 datetime
  end: string; // ISO 8601 datetime
}

/**
 * Search location input
 */
export interface SearchLocation {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  formattedAddress?: string;
}

/**
 * Main search criteria interface
 */
export interface SearchCriteria {
  // Location
  location: SearchLocation;
  maxDistance: number; // in miles

  // Date/Time
  dateRange: DateTimeRange;

  // Price
  priceRange?: PriceRange;

  // Vehicle filters
  vehicleTypes?: VehicleType[];
  transmission?: TransmissionType[];
  fuelType?: FuelType[];
  features?: VehicleFeature[];

  // Capacity
  minSeats?: number;

  // Booking preferences
  instantBookOnly?: boolean;
  deliveryAvailable?: boolean;

  // Host
  minHostRating?: number;
  superHostOnly?: boolean;

  // Sorting
  sortBy: SearchSortBy;
}

/**
 * Active filter for display
 */
export interface ActiveFilter {
  type: keyof SearchCriteria | 'custom';
  label: string;
  value: string | number | boolean;
  removable: boolean;
}

/**
 * Search results pagination
 */
export interface SearchPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Search results response
 */
export interface SearchResults {
  vehicles: VehicleListItem[];
  pagination: SearchPagination;
  appliedFilters: ActiveFilter[];
  totalCount: number;
  searchId?: string; // for analytics
}

/**
 * Search suggestion
 */
export interface SearchSuggestion {
  id: string;
  type: 'location' | 'recent' | 'popular' | 'vehicle';
  title: string;
  subtitle?: string;
  coordinates?: Coordinates;
  icon: string;
}

/**
 * Recent search item
 */
export interface RecentSearch {
  id: string;
  criteria: SearchCriteria;
  timestamp: string;
  resultsCount: number;
}

/**
 * Saved search for notifications
 */
export interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchCriteria;
  notificationsEnabled: boolean;
  createdAt: string;
  lastMatchedAt?: string;
}

/**
 * Map region for search
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Map marker for vehicle
 */
export interface VehicleMarker {
  id: string;
  coordinate: Coordinates;
  price: number;
  isSelected: boolean;
  vehicleType: VehicleType;
}

/**
 * Cluster of vehicle markers
 */
export interface MarkerCluster {
  id: string;
  coordinate: Coordinates;
  count: number;
  bounds: {
    northeast: Coordinates;
    southwest: Coordinates;
  };
}

/**
 * Filter options with counts
 */
export interface FilterOption<T> {
  value: T;
  label: string;
  count: number;
  disabled?: boolean;
}

/**
 * Available filter options based on current search
 */
export interface AvailableFilters {
  vehicleTypes: FilterOption<VehicleType>[];
  transmissions: FilterOption<TransmissionType>[];
  fuelTypes: FilterOption<FuelType>[];
  features: FilterOption<VehicleFeature>[];
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  maxDistance: number;
}

/**
 * Default search criteria
 */
export const DEFAULT_SEARCH_CRITERIA: Partial<SearchCriteria> = {
  maxDistance: 25,
  sortBy: 'recommended',
  instantBookOnly: false,
  deliveryAvailable: false,
  superHostOnly: false,
};

/**
 * Sort option display info
 */
export const SORT_OPTIONS: Record<SearchSortBy, { label: string; icon: string }> = {
  recommended: { label: 'Recommended', icon: 'star' },
  price_low_to_high: { label: 'Price: Low to High', icon: 'arrow-up' },
  price_high_to_low: { label: 'Price: High to Low', icon: 'arrow-down' },
  distance: { label: 'Distance: Nearest', icon: 'map-pin' },
  rating: { label: 'Rating: Highest', icon: 'thumbs-up' },
  newest: { label: 'Newest Listings', icon: 'clock' },
};

/**
 * Quick duration presets
 */
export interface QuickDuration {
  id: string;
  label: string;
  hours: number;
}

export const QUICK_DURATIONS: QuickDuration[] = [
  { id: '2h', label: '2 hours', hours: 2 },
  { id: '4h', label: '4 hours', hours: 4 },
  { id: '1d', label: '1 day', hours: 24 },
  { id: 'weekend', label: 'Weekend', hours: 48 },
  { id: '1w', label: '1 week', hours: 168 },
];
