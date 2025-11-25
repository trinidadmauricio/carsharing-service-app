/**
 * Types Index
 * Re-export all types for convenient imports
 */

export * from './auth';
export type {
  User,
  GuestProfile,
  HostProfile,
  CoHost,
  CoHostPermission,
  TripSummary,
  TripStatus,
  ClaimSummary,
  ClaimType,
  ClaimStatus,
  VehicleSummary,
  VehicleStatus,
  UserPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  PaymentPreferences,
  IDVerificationData,
} from './user';
export * from './protection';
export * from './riskScore';
export * from './vehicle';
export * from './search';
export * from './booking';
