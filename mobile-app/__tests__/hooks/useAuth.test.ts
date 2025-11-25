/**
 * useAuth Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth, useAuthStore } from '@/hooks/useAuth';

import * as SecureStore from 'expo-secure-store';
import { svc } from '@/services';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@/services', () => ({
  svc: {
    auth: {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    },
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
    });
  });

  describe('initial state', () => {
    it('starts with loading state', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isLoading).toBe(true);
    });

    it('starts with no user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
    });

    it('starts not authenticated', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('successfully logs in with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['guest'] as const,
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      (svc.auth.login as jest.Mock).mockResolvedValue({
        success: true,
        data: { user: mockUser, tokens: mockTokens },
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: { success: boolean; error?: string };

      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!.success).toBe(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token'
      );
    });

    it('returns error for invalid credentials', async () => {
      (svc.auth.login as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Invalid credentials' },
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: { success: boolean; error?: string };

      await act(async () => {
        loginResult = await result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });
      });

      expect(loginResult!.success).toBe(false);
      expect(loginResult!.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('clears user data on logout', async () => {
      // Set up authenticated state
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' } as any,
        isAuthenticated: true,
        accessToken: 'token',
      });

      (svc.auth.logout as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(router.replace).toHaveBeenCalledWith('/(auth)');
    });

    it('clears secure storage on logout', async () => {
      (svc.auth.logout as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('refreshSession', () => {
    it('refreshes session with valid refresh token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
      };

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('old-refresh-token');
      (svc.auth.refreshToken as jest.Mock).mockResolvedValue({
        success: true,
        data: { user: mockUser, tokens: mockTokens },
      });

      const { result } = renderHook(() => useAuth());

      let refreshResult: boolean;

      await act(async () => {
        refreshResult = await result.current.refreshSession();
      });

      expect(refreshResult!).toBe(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token'
      );
    });

    it('returns false when no refresh token exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth());

      let refreshResult: boolean;

      await act(async () => {
        refreshResult = await result.current.refreshSession();
      });

      expect(refreshResult!).toBe(false);
    });

    it('returns false when refresh token is invalid', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('invalid-token');
      (svc.auth.refreshToken as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Invalid token' },
      });

      const { result } = renderHook(() => useAuth());

      let refreshResult: boolean;

      await act(async () => {
        refreshResult = await result.current.refreshSession();
      });

      expect(refreshResult!).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('updates user data', () => {
      const initialUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      } as any;

      useAuthStore.setState({
        user: initialUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.updateUser({ firstName: 'Updated' });
      });

      expect(result.current.user?.firstName).toBe('Updated');
      expect(result.current.user?.lastName).toBe('User');
    });
  });
});
