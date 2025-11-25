/**
 * Hooks Index
 * Custom React hooks
 */

// Auth hooks
export { useAuth, useAuthStore } from './useAuth';
export { useSecureStorage, STORAGE_KEYS } from './useSecureStorage';
export { useBiometrics, getBiometricDisplayName } from './useBiometrics';
export type { BiometricType } from './useBiometrics';

// Vehicle search hooks
export {
  useVehicleSearch,
  useVehicleDetail,
  useVehicleAvailability,
  useFavorites,
  useRecentlyViewed,
  useSimilarVehicles,
  usePopularVehicles,
  vehicleKeys,
} from './useVehicleSearch';

// Location hooks
export { useLocation, formatDistance, DEFAULT_LOCATION } from './useLocation';

// Booking hooks
export { useBookingEligibility, useUserRiskScore } from './useBookingEligibility';
