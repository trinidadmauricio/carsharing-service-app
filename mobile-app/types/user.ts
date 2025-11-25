/**
 * User Types
 * Extended user profile and guest/host specific types
 */

import type { User } from './auth';

export interface GuestProfile extends User {
  dateOfBirth: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpirationDate: string;
  idVerified: boolean;
  faceMatchVerified: boolean;
  tripHistory: TripSummary[];
  averageRating: number;
  totalTrips: number;
  claims: ClaimSummary[];
  favoriteVehicles: string[];
}

export interface HostProfile extends User {
  businessName?: string;
  taxId?: string;
  protectionPlanId: string;
  vehicles: VehicleSummary[];
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
  responseTime: number; // in minutes
  superHostStatus: boolean;
  coHosts: CoHost[];
}

export interface CoHost {
  id: string;
  userId: string;
  email: string;
  name: string;
  permissions: CoHostPermission[];
  invitedAt: string;
  acceptedAt?: string;
  status: 'pending' | 'active' | 'revoked';
}

export type CoHostPermission =
  | 'pricing'
  | 'availability'
  | 'trips'
  | 'earnings'
  | 'settings'
  | 'messages';

export interface TripSummary {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  totalCost: number;
  rating?: number;
}

export type TripStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface ClaimSummary {
  id: string;
  tripId: string;
  type: ClaimType;
  status: ClaimStatus;
  atFault: boolean;
  amount: number;
  filedAt: string;
}

export type ClaimType = 'damage' | 'theft' | 'accident' | 'other';

export type ClaimStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'resolved';

export interface VehicleSummary {
  id: string;
  make: string;
  model: string;
  year: number;
  photoUrl: string;
  status: VehicleStatus;
  instantBookEnabled: boolean;
  pricePerDay: number;
  totalTrips: number;
  averageRating: number;
}

export type VehicleStatus =
  | 'pending_approval'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'deleted';

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  payment: PaymentPreferences;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  bookingUpdates: boolean;
  tripReminders: boolean;
  promotions: boolean;
  messages: boolean;
}

export interface PrivacyPreferences {
  shareLocation: boolean;
  shareProfile: boolean;
  allowAnalytics: boolean;
}

export interface PaymentPreferences {
  defaultPaymentMethodId?: string;
  autoPay: boolean;
  currency: string;
}

export interface IDVerificationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  expirationDate: string;
  licenseNumber: string;
  state: string;
  address?: string;
}
