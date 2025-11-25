/**
 * useAuth Hook
 * Authentication state management and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { create } from 'zustand';

import { useSecureStorage, STORAGE_KEYS } from './useSecureStorage';
import { useBiometrics } from './useBiometrics';
import { svc } from '@/services';
import type { User, UserRole, LoginCredentials, AuthTokens } from '@/types/auth';

// Auth state store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  reset: () =>
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      isLoading: false,
    }),
}));

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  loginWithBiometrics: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
}

export function useAuth(): UseAuthReturn {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAccessToken,
    setIsLoading,
    reset,
  } = useAuthStore();

  const { setItem, getItem, deleteItem, clearAll } = useSecureStorage();
  const { authenticate, isAvailable: biometricsAvailable } = useBiometrics();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (refreshToken) {
          // Try to refresh the session
          const success = await refreshSession();
          if (!success) {
            // Clear invalid tokens
            await clearAll();
            reset();
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      try {
        const response = await svc.auth.login(credentials);

        const { user: userData, tokens } = response;

        // Store refresh token securely (NEVER store access token)
        await setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        await setItem(STORAGE_KEYS.USER_ID, userData.id);

        // Store access token in memory only
        setAccessToken(tokens.accessToken);
        setUser(userData);

        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [setItem, setAccessToken, setUser, setIsLoading]
  );

  const loginWithBiometrics = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!biometricsAvailable) {
      return { success: false, error: 'Biometrics not available' };
    }

    // Check if biometrics is enabled for this user
    const biometricsEnabled = await getItem(STORAGE_KEYS.BIOMETRICS_ENABLED);
    if (biometricsEnabled !== 'true') {
      return { success: false, error: 'Biometrics not enabled' };
    }

    // Authenticate with biometrics
    const authenticated = await authenticate('Sign in with biometrics');
    if (!authenticated) {
      return { success: false, error: 'Biometric authentication failed' };
    }

    // Try to refresh session using stored refresh token
    const refreshed = await refreshSession();
    if (!refreshed) {
      return { success: false, error: 'Session expired. Please sign in with your password.' };
    }

    return { success: true };
  }, [biometricsAvailable, getItem, authenticate]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout API
      await svc.auth.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all stored data
      await clearAll();
      reset();

      // Navigate to welcome screen
      router.replace('/(auth)');
    }
  }, [clearAll, reset]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = await getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        setIsLoading(false);
        return false;
      }

      const response = await svc.auth.refreshToken(refreshToken);

      const { tokens } = response;

      // Update stored refresh token
      await setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

      // Update memory state
      setAccessToken(tokens.accessToken);
      // Note: User data is not returned in refresh, keep existing user
      setIsLoading(false);

      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      setIsLoading(false);
      return false;
    }
  }, [getItem, setItem, setAccessToken, setUser, setIsLoading]);

  const updateUser = useCallback(
    (updates: Partial<User>): void => {
      if (user) {
        setUser({ ...user, ...updates });
      }
    },
    [user, setUser]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithBiometrics,
    logout,
    refreshSession,
    updateUser,
  };
}
