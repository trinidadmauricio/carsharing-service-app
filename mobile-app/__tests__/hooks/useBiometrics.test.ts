/**
 * useBiometrics Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useBiometrics, getBiometricDisplayName } from '@/hooks/useBiometrics';

import * as LocalAuthentication from 'expo-local-authentication';

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  supportedAuthenticationTypesAsync: jest.fn(),
  authenticateAsync: jest.fn(),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

describe('useBiometrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts in loading state', () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useBiometrics());

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('availability check', () => {
    it('detects when biometrics hardware is available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAvailable).toBe(true);
      expect(result.current.isEnrolled).toBe(true);
    });

    it('detects when biometrics hardware is not available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isEnrolled).toBe(false);
    });

    it('detects fingerprint biometric type', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('fingerprint');
    });

    it('detects facial recognition biometric type', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      ]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('facial');
    });

    it('prefers facial recognition over fingerprint', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      ]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.biometricType).toBe('facial');
    });
  });

  describe('authentication', () => {
    it('returns true on successful authentication', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: boolean;

      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult!).toBe(true);
      expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });
    });

    it('returns false on failed authentication', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: false,
        error: 'user_cancel',
      });

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: boolean;

      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult!).toBe(false);
    });

    it('returns false when biometrics not available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let authResult: boolean;

      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult!).toBe(false);
      expect(LocalAuthentication.authenticateAsync).not.toHaveBeenCalled();
    });

    it('uses custom prompt message', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useBiometrics());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.authenticate('Custom prompt');
      });

      expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          promptMessage: 'Custom prompt',
        })
      );
    });
  });
});

describe('getBiometricDisplayName', () => {
  it('returns "Face ID" for facial', () => {
    expect(getBiometricDisplayName('facial')).toBe('Face ID');
  });

  it('returns "Touch ID" for fingerprint', () => {
    expect(getBiometricDisplayName('fingerprint')).toBe('Touch ID');
  });

  it('returns "Iris Scan" for iris', () => {
    expect(getBiometricDisplayName('iris')).toBe('Iris Scan');
  });

  it('returns "Biometrics" for none', () => {
    expect(getBiometricDisplayName('none')).toBe('Biometrics');
  });
});
