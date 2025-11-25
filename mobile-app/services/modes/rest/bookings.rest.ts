/**
 * REST Booking Service
 * Handles booking operations via REST API
 */

import { apiClient } from '../../apiClient';
import type { BookingService } from '../../bookings';
import type {
  Booking,
  BookingListItem,
  BookingFilters,
  CreateBookingRequest,
  CreateCheckoutRequest,
  CheckoutResponse,
} from '@/types/booking';

export const bookingsRest: BookingService = {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', data);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create booking');
    }

    return response.data!;
  },

  /**
   * Get booking by ID
   */
  async getById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch booking');
    }

    return response.data!;
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(filters?: BookingFilters): Promise<BookingListItem[]> {
    const params = new URLSearchParams();

    if (filters?.status) {
      filters.status.forEach((s) => params.append('status', s));
    }
    if (filters?.startDateFrom) {
      params.append('startDateFrom', filters.startDateFrom);
    }
    if (filters?.startDateTo) {
      params.append('startDateTo', filters.startDateTo);
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const url = `/bookings${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<BookingListItem[]>(url);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch bookings');
    }

    return response.data!;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to cancel booking');
    }
  },

  /**
   * Create payment checkout session
   */
  async createCheckout(
    data: CreateCheckoutRequest
  ): Promise<CheckoutResponse> {
    const response = await apiClient.post<CheckoutResponse>(
      '/payments/checkout',
      data
    );

    if (!response.success) {
      throw new Error(
        response.error?.message || 'Failed to create checkout session'
      );
    }

    return response.data!;
  },

  /**
   * Confirm payment after checkout
   */
  async confirmPayment(bookingId: string, sessionId: string): Promise<Booking> {
    const response = await apiClient.post<Booking>(
      `/payments/confirm`,
      { bookingId, sessionId }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to confirm payment');
    }

    return response.data!;
  },
};
