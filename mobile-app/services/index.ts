/**
 * Services Index
 * Mode selector for mock/rest implementations
 */

import Constants from 'expo-constants';
import { AuthService } from './auth';
import { authMock } from './modes/mock/auth.mock';
import { authRest } from './modes/rest/auth.rest';

type ApiMode = 'mock' | 'live';

const getApiMode = (): ApiMode => {
  const mode = Constants.expoConfig?.extra?.apiMode as string;
  return mode === 'live' ? 'live' : 'mock';
};

interface Services {
  auth: AuthService;
  // Add more services as they are implemented:
  // vehicles: VehicleService;
  // bookings: BookingService;
  // protection: ProtectionService;
  // pricing: PricingService;
  // claims: ClaimsService;
  // verification: VerificationService;
}

const createServices = (mode: ApiMode): Services => {
  const isMock = mode === 'mock';

  return {
    auth: isMock ? authMock : authRest,
    // vehicles: isMock ? vehiclesMock : vehiclesRest,
    // bookings: isMock ? bookingsMock : bookingsRest,
    // protection: isMock ? protectionMock : protectionRest,
    // pricing: isMock ? pricingMock : pricingRest,
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

// Export API client for direct use when needed
export { apiClient } from './apiClient';

// Log current mode in development
if (__DEV__) {
  console.log(`[Services] Running in ${getApiMode()} mode`);
}
