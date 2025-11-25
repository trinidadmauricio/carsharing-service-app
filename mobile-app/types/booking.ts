/**
 * Booking Types
 * Types for vehicle bookings and reservations
 */

import type { ProtectionPlan } from './protection';

/**
 * Booking status
 */
export type BookingStatus =
  | 'pending' // Awaiting host approval
  | 'confirmed' // Host approved, payment pending
  | 'paid' // Payment completed
  | 'active' // Trip in progress
  | 'completed' // Trip finished
  | 'cancelled' // Booking cancelled
  | 'declined'; // Host declined

/**
 * Payment status
 */
export type PaymentStatus =
  | 'pending' // Payment not initiated
  | 'processing' // Payment in progress
  | 'succeeded' // Payment successful
  | 'failed' // Payment failed
  | 'refunded'; // Payment refunded

/**
 * Payment method types
 */
export type PaymentMethod = 'card' | 'bank_transfer' | 'wallet';

/**
 * Booking request data
 */
export interface CreateBookingRequest {
  vehicleId: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  protectionPlanId: string;
  instantBook: boolean;
}

/**
 * Booking response from API
 */
export interface Booking {
  id: string;
  guestId: string;
  hostId: string;
  vehicleId: string;
  status: BookingStatus;

  // Dates and times
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format

  // Protection
  protectionPlan: ProtectionPlan;

  // Pricing
  pricing: {
    dailyRate: number;
    tripDays: number;
    subtotal: number;
    protectionPrice: number;
    serviceFee: number;
    discounts: number;
    total: number;
  };

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Metadata
  instantBook: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  confirmedAt?: string; // ISO 8601
  paidAt?: string; // ISO 8601
}

/**
 * Payment checkout request
 */
export interface CreateCheckoutRequest {
  bookingId: string;
}

/**
 * Payment checkout response
 */
export interface CheckoutResponse {
  checkoutUrl: string; // URL to open in web browser
  sessionId: string; // Payment session ID for tracking
}

/**
 * Payment result from deep link
 */
export interface PaymentResult {
  bookingId: string;
  status: 'success' | 'cancelled' | 'error';
  sessionId?: string;
  errorMessage?: string;
}

/**
 * Booking list item (summary)
 */
export interface BookingListItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  total: number;
  instantBook: boolean;
}

/**
 * Booking filters
 */
export interface BookingFilters {
  status?: BookingStatus[];
  startDateFrom?: string;
  startDateTo?: string;
  limit?: number;
  offset?: number;
}
