/**
 * Services Index
 * Mode selector for mock/rest implementations
 */

import Constants from 'expo-constants';
import { AuthService } from './auth';
import { VehicleService } from './vehicles';
import { BookingService } from './bookings';
import { PricingService } from './pricing';
import { authMock } from './modes/mock/auth.mock';
import { authRest } from './modes/rest/auth.rest';
import { vehiclesMock } from './modes/mock/vehicles.mock';
import { vehiclesRest } from './modes/rest/vehicles.rest';
import { bookingsMock } from './modes/mock/bookings.mock';
import { bookingsRest } from './modes/rest/bookings.rest';
import { pricingMock } from './modes/mock/pricing.mock';
import { pricingRest } from './modes/rest/pricing.rest';

type ApiMode = 'mock' | 'live';

const getApiMode = (): ApiMode => {
  const mode = Constants.expoConfig?.extra?.apiMode as string;
  return mode === 'live' ? 'live' : 'mock';
};

interface Services {
  auth: AuthService;
  vehicles: VehicleService;
  bookings: BookingService;
  pricing: PricingService;
  // Add more services as they are implemented:
  // protection: ProtectionService;
  // claims: ClaimsService;
  // verification: VerificationService;
}

const createServices = (mode: ApiMode): Services => {
  const isMock = mode === 'mock';

  return {
    auth: isMock ? authMock : authRest,
    vehicles: isMock ? vehiclesMock : vehiclesRest,
    bookings: isMock ? bookingsMock : bookingsRest,
    pricing: isMock ? pricingMock : pricingRest,
    // protection: isMock ? protectionMock : protectionRest,
    // claims: isMock ? claimsMock : claimsRest,
    // verification: isMock ? verificationMock : verificationRest,
  };
};

// Export services instance
export const svc = createServices(getApiMode());

// Export for type checking
export type { Services };

// Re-export service interfaces
export type { AuthService } from './auth';
export type { VehicleService } from './vehicles';
export type { BookingService } from './bookings';
export type { PricingService } from './pricing';

// Export API client for direct use when needed
export { apiClient } from './apiClient';

// Log current mode in development
if (__DEV__) {
  console.log(`[Services] Running in ${getApiMode()} mode`);
}
