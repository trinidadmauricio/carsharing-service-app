/**
 * Vehicles REST Service
 * REST API implementation for vehicle operations
 */

import type {
  AvailabilitySlot,
  SearchResults,
  VehicleDetail,
  VehicleListItem,
} from '@/types';
import { apiClient } from '../../apiClient';
import type {
  FavoritesResponse,
  VehicleAvailabilityRequest,
  VehicleSearchRequest,
  VehicleService,
} from '../../vehicles';

export const vehiclesRest: VehicleService = {
  async search(request: VehicleSearchRequest): Promise<SearchResults> {
    const response = await apiClient.post<SearchResults>('/vehicles/search', {
      ...request.criteria,
      page: request.page,
      pageSize: request.pageSize,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Search failed');
    }

    return response.data;
  },

  async getById(vehicleId: string): Promise<VehicleDetail> {
    const response = await apiClient.get<VehicleDetail>(`/vehicles/${vehicleId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Vehicle not found');
    }

    return response.data;
  },

  async getAvailability(request: VehicleAvailabilityRequest): Promise<AvailabilitySlot[]> {
    const queryString =
      request.startDate && request.endDate
        ? `?startDate=${request.startDate}&endDate=${request.endDate}`
        : '';
    const response = await apiClient.get<AvailabilitySlot[]>(
      `/vehicles/${request.vehicleId}/availability${queryString}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get availability');
    }

    return response.data;
  },

  async getFavorites(): Promise<FavoritesResponse> {
    const response = await apiClient.get<FavoritesResponse>('/users/me/favorites');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get favorites');
    }

    return response.data;
  },

  async addToFavorites(vehicleId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      `/users/me/favorites/${vehicleId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to add to favorites');
    }

    return response.data;
  },

  async removeFromFavorites(vehicleId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      `/users/me/favorites/${vehicleId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to remove from favorites');
    }

    return response.data;
  },

  async getRecentlyViewed(): Promise<VehicleListItem[]> {
    const response = await apiClient.get<VehicleListItem[]>('/users/me/recently-viewed');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get recently viewed');
    }

    return response.data;
  },

  async trackView(vehicleId: string): Promise<void> {
    await apiClient.post(`/vehicles/${vehicleId}/view`);
    // Fire and forget - we don't care about the response
  },

  async getSimilar(vehicleId: string, limit = 4): Promise<VehicleListItem[]> {
    const response = await apiClient.get<VehicleListItem[]>(
      `/vehicles/${vehicleId}/similar?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get similar vehicles');
    }

    return response.data;
  },

  async getPopularInArea(
    latitude: number,
    longitude: number,
    limit = 6
  ): Promise<VehicleListItem[]> {
    const response = await apiClient.get<VehicleListItem[]>(
      `/vehicles/popular?latitude=${latitude}&longitude=${longitude}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get popular vehicles');
    }

    return response.data;
  },
};
