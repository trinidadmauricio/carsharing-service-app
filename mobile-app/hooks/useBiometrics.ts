/**
 * useBiometrics Hook
 * Biometric authentication using expo-local-authentication
 */

import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

interface UseBiometricsReturn {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
  isLoading: boolean;
  authenticate: (promptMessage?: string) => Promise<boolean>;
  checkAvailability: () => Promise<void>;
}

export function useBiometrics(): UseBiometricsReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAvailability = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Check if hardware supports biometrics
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      setIsAvailable(hasHardware);

      if (hasHardware) {
        // Check if biometrics are enrolled
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        // Get supported authentication types
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('facial');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('iris');
        } else {
          setBiometricType('none');
        }
      }
    } catch (error) {
      console.error('Error checking biometrics:', error);
      setIsAvailable(false);
      setIsEnrolled(false);
      setBiometricType('none');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const authenticate = useCallback(
    async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
      if (!isAvailable || !isEnrolled) {
        return false;
      }

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage,
          fallbackLabel: 'Use passcode',
          disableDeviceFallback: false,
          cancelLabel: 'Cancel',
        });

        return result.success;
      } catch (error) {
        console.error('Biometric authentication error:', error);
        return false;
      }
    },
    [isAvailable, isEnrolled]
  );

  return {
    isAvailable,
    biometricType,
    isEnrolled,
    isLoading,
    authenticate,
    checkAvailability,
  };
}

// Helper to get display name for biometric type
export function getBiometricDisplayName(type: BiometricType): string {
  switch (type) {
    case 'facial':
      return 'Face ID';
    case 'fingerprint':
      return 'Touch ID';
    case 'iris':
      return 'Iris Scan';
    default:
      return 'Biometrics';
  }
}
