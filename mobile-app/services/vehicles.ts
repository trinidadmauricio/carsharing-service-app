/**
 * Vehicles Service Interface
 * Defines the contract for vehicle search and management operations
 */

import type {
  AvailabilitySlot,
  SearchCriteria,
  SearchResults,
  VehicleDetail,
  VehicleListItem,
} from '@/types';

export interface VehicleSearchRequest {
  criteria: SearchCriteria;
  page?: number;
  pageSize?: number;
}

export interface VehicleAvailabilityRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
}

export interface FavoritesResponse {
  vehicles: VehicleListItem[];
  total: number;
}

export interface VehicleService {
  /**
   * Search for available vehicles
   */
  search(request: VehicleSearchRequest): Promise<SearchResults>;

  /**
   * Get vehicle details by ID
   */
  getById(vehicleId: string): Promise<VehicleDetail>;

  /**
   * Get vehicle availability for date range
   */
  getAvailability(request: VehicleAvailabilityRequest): Promise<AvailabilitySlot[]>;

  /**
   * Get user's favorite vehicles
   */
  getFavorites(): Promise<FavoritesResponse>;

  /**
   * Add vehicle to favorites
   */
  addToFavorites(vehicleId: string): Promise<{ success: boolean }>;

  /**
   * Remove vehicle from favorites
   */
  removeFromFavorites(vehicleId: string): Promise<{ success: boolean }>;

  /**
   * Get recently viewed vehicles
   */
  getRecentlyViewed(): Promise<VehicleListItem[]>;

  /**
   * Track vehicle view (for analytics and recently viewed)
   */
  trackView(vehicleId: string): Promise<void>;

  /**
   * Get similar vehicles
   */
  getSimilar(vehicleId: string, limit?: number): Promise<VehicleListItem[]>;

  /**
   * Get popular vehicles in location
   */
  getPopularInArea(
    latitude: number,
    longitude: number,
    limit?: number
  ): Promise<VehicleListItem[]>;
}
