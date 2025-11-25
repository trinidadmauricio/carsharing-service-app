/**
 * Host Types
 * Types for host registration, vehicles, and dashboard
 */

import type { ProtectionPlan } from './protection';
import type {
  VehiclePhoto as BaseVehiclePhoto,
  VehiclePricing as BaseVehiclePricing,
  VehicleLocation as BaseVehicleLocation,
} from './vehicle';

/**
 * Host onboarding status
 */
export type HostOnboardingStatus =
  | 'not_started'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected';

/**
 * Host onboarding step
 */
export type HostOnboardingStep =
  | 'benefits'
  | 'requirements'
  | 'documents'
  | 'protection'
  | 'complete';

/**
 * Host onboarding data
 */
export interface HostOnboarding {
  userId: string;
  status: HostOnboardingStatus;
  currentStep: HostOnboardingStep;
  completedSteps: HostOnboardingStep[];

  // Documents
  documents?: HostDocuments;

  // Protection plan
  protectionPlanId?: string;

  // Metadata
  startedAt: string;
  completedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

/**
 * Host documents
 */
export interface HostDocuments {
  // Driver's license
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  licenseFrontPhoto?: string;
  licenseBackPhoto?: string;

  // Vehicle registration
  registrationNumber?: string;
  registrationExpiration?: string;
  registrationPhoto?: string;

  // Insurance
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiration?: string;
  insurancePhoto?: string;

  // Bank account (for payouts)
  bankAccountLast4?: string;
  bankRoutingNumber?: string;

  // Verification status
  documentsVerified: boolean;
  verifiedAt?: string;
}

/**
 * Earnings projection
 */
export interface EarningsProjection {
  dailyRate: number;
  protectionPlan: ProtectionPlan;

  // Calculations
  platformFee: number; // Percentage (15-40% depending on protection)
  hostEarnings: number; // dailyRate * protectionPlan.earningsPercentage

  // Estimates
  monthlyTrips: number;
  monthlyEarnings: number;
  yearlyEarnings: number;

  // Factors
  utilizationRate: number; // Estimated % of time rented (20-60%)
  averageTripLength: number; // In days
}

/**
 * Host requirement
 */
export interface HostRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  icon: string;
}

/**
 * Host benefit
 */
export interface HostBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

/**
 * Vehicle listing status
 */
export type VehicleListingStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'rejected';

/**
 * Vehicle basic info
 */
export interface VehicleBasicInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin: string;
  licensePlate: string;
  color: string;
  odometer: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  doors: number;
}

/**
 * Vehicle listing
 */
export interface VehicleListing {
  id: string;
  hostId: string;
  status: VehicleListingStatus;

  // Basic info
  basicInfo: VehicleBasicInfo;

  // Description
  title: string;
  description: string;

  // Photos
  photos: BaseVehiclePhoto[];

  // Location
  location: BaseVehicleLocation;

  // Pricing
  pricing: BaseVehiclePricing;

  // Features & amenities
  features: string[];

  // Availability
  availability: VehicleAvailability;

  // Instant book
  instantBookEnabled: boolean;
  guestRequirements?: GuestRequirements;

  // Metadata
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedAt?: string;
}

/**
 * Vehicle availability
 */
export interface VehicleAvailability {
  // Calendar
  blockedDates: string[]; // ISO dates
  advanceNotice: number; // hours (e.g., 2, 4, 8, 24)
  minTripDuration: number; // days
  maxTripDuration: number; // days

  // Schedule
  availableStartTime?: string; // HH:mm (e.g., "08:00")
  availableEndTime?: string; // HH:mm (e.g., "20:00")
}

/**
 * Guest requirements
 */
export interface GuestRequirements {
  minAge: number; // e.g., 21, 25
  minTrips?: number; // Minimum trips completed
  minRating?: number; // Minimum rating (e.g., 4.5)
  maxClaims?: number; // Maximum claims allowed
  idVerificationRequired: boolean;
}

/**
 * Host dashboard stats
 */
export interface HostDashboardStats {
  // Earnings
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  pendingPayouts: number;

  // Trips
  totalTrips: number;
  activeTrips: number;
  upcomingTrips: number;
  completedTrips: number;

  // Vehicles
  totalVehicles: number;
  activeVehicles: number;
  inactiveVehicles: number;
  pendingApproval: number;

  // Performance
  averageRating: number;
  responseRate: number;
  acceptanceRate: number;

  // Requests
  pendingRequests: number;
}
