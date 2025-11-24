/**
 * useSecureStorage Hook
 * Secure storage operations using expo-secure-store
 */

import { useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

// Storage keys
export const STORAGE_KEYS = {
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  BIOMETRICS_ENABLED: 'biometrics_enabled',
  REMEMBER_EMAIL: 'remember_email',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

interface UseSecureStorageReturn {
  setItem: (key: StorageKey, value: string) => Promise<void>;
  getItem: (key: StorageKey) => Promise<string | null>;
  deleteItem: (key: StorageKey) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useSecureStorage(): UseSecureStorageReturn {
  const setItem = useCallback(async (key: StorageKey, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw new Error(`Failed to store ${key}`);
    }
  }, []);

  const getItem = useCallback(async (key: StorageKey): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }, []);

  const deleteItem = useCallback(async (key: StorageKey): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      await Promise.all(
        Object.values(STORAGE_KEYS).map((key) => SecureStore.deleteItemAsync(key))
      );
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  return {
    setItem,
    getItem,
    deleteItem,
    clearAll,
  };
}
