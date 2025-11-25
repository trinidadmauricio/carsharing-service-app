/**
 * Mock Booking Service
 * Simulates booking operations with local data
 */

import type { BookingService } from '../../bookings';
import type {
  Booking,
  BookingListItem,
  BookingFilters,
  CreateBookingRequest,
  CreateCheckoutRequest,
  CheckoutResponse,
} from '@/types/booking';
import { GUEST_PROTECTION_PLANS } from '@/types/protection';

// Simulated delay for network requests
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock bookings store
let mockBookings: Booking[] = [];
let bookingIdCounter = 1;

export const bookingsMock: BookingService = {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    await delay(800);

    const protectionPlan = GUEST_PROTECTION_PLANS.find(
      (p) => p.id === data.protectionPlanId
    );

    if (!protectionPlan) {
      throw new Error('Protection plan not found');
    }

    // Calculate days
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const tripDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Mock pricing (in real app, this comes from backend)
    const dailyRate = 45; // $45/day mock rate
    const subtotal = dailyRate * tripDays;
    const protectionPrice = (protectionPlan.price ?? 0) * tripDays;
    const serviceFee = subtotal * 0.15;
    const discounts = 0;
    const total = subtotal + protectionPrice + serviceFee - discounts;

    const booking: Booking = {
      id: `booking-${bookingIdCounter++}`,
      guestId: 'user-1',
      hostId: 'host-1',
      vehicleId: data.vehicleId,
      status: data.instantBook ? 'confirmed' : 'pending',
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      protectionPlan,
      pricing: {
        dailyRate,
        tripDays,
        subtotal,
        protectionPrice,
        serviceFee,
        discounts,
        total,
      },
      paymentStatus: 'pending',
      instantBook: data.instantBook,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmedAt: data.instantBook ? new Date().toISOString() : undefined,
    };

    mockBookings.push(booking);
    return booking;
  },

  /**
   * Get booking by ID
   */
  async getById(bookingId: string): Promise<Booking> {
    await delay(500);

    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(filters?: BookingFilters): Promise<BookingListItem[]> {
    await delay(600);

    let filteredBookings = [...mockBookings];

    // Apply filters
    if (filters?.status) {
      filteredBookings = filteredBookings.filter((b) =>
        filters.status!.includes(b.status)
      );
    }

    // Convert to list items
    const listItems: BookingListItem[] = filteredBookings.map((b) => ({
      id: b.id,
      vehicleId: b.vehicleId,
      vehicleName: '2024 Honda Civic', // Mock vehicle name
      vehicleImage: 'https://picsum.photos/seed/civic/400/300',
      startDate: b.startDate,
      endDate: b.endDate,
      status: b.status,
      paymentStatus: b.paymentStatus,
      total: b.pricing.total,
      instantBook: b.instantBook,
    }));

    return listItems;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await delay(700);

    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date().toISOString();
  },

  /**
   * Create payment checkout session
   */
  async createCheckout(
    data: CreateCheckoutRequest
  ): Promise<CheckoutResponse> {
    await delay(1000);

    const booking = mockBookings.find((b) => b.id === data.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Mock Stripe Checkout URL
    const sessionId = `cs_test_${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}#fidkdWxOYHwnPyd1blpxYHZxWjA0TUl8VWJGPW5PNzE2Nj1wS29xbEJQXW1kZjVobGZ9PXBzbW9PXXNLfFxfbGZkQWNqYG5hV2RANzdgPEp0X2N0Y0NONzc8XFwxYTZrXzBmdHRuNlxBZkB8fURpXDdAJyknd2BjYHd3YHdKd2xibGsnPydtcXF1dj8qKmApJ2N3amhWYHdzYHcnPyd1dGdscWxhJz8nNjU1PDMzPTQ2NDQzJ3gl`;

    return {
      checkoutUrl,
      sessionId,
    };
  },

  /**
   * Confirm payment after checkout
   */
  async confirmPayment(bookingId: string, sessionId: string): Promise<Booking> {
    await delay(800);

    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Update booking status
    booking.paymentStatus = 'succeeded';
    booking.status = 'paid';
    booking.paidAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    return booking;
  },
};
