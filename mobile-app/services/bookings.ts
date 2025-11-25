/**
 * Booking Service Interface
 * Handles vehicle bookings and reservations
 */

import type {
  Booking,
  BookingListItem,
  BookingFilters,
  CreateBookingRequest,
  CreateCheckoutRequest,
  CheckoutResponse,
} from '@/types/booking';

/**
 * Booking Service Interface
 */
export interface BookingService {
  /**
   * Create a new booking
   */
  createBooking(data: CreateBookingRequest): Promise<Booking>;

  /**
   * Get booking by ID
   */
  getById(bookingId: string): Promise<Booking>;

  /**
   * Get user's bookings
   */
  getMyBookings(filters?: BookingFilters): Promise<BookingListItem[]>;

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId: string): Promise<void>;

  /**
   * Create payment checkout session
   */
  createCheckout(data: CreateCheckoutRequest): Promise<CheckoutResponse>;

  /**
   * Confirm payment after checkout
   */
  confirmPayment(bookingId: string, sessionId: string): Promise<Booking>;
}
