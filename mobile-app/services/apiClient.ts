/**
 * API Client
 * HTTP client with automatic token refresh and error handling
 */

import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { AuthTokens } from '@/types/auth';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl ?? 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retryOnUnauthorized?: boolean;
}

const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
} as const;

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  async initialize(): Promise<void> {
    try {
      this.refreshToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
      const expiry = await SecureStore.getItemAsync(SECURE_STORE_KEYS.TOKEN_EXPIRY);
      this.tokenExpiry = expiry ? parseInt(expiry, 10) : null;
      // Note: Access token is NOT stored - it stays in memory only
    } catch (error) {
      console.error('Failed to initialize API client:', error);
    }
  }

  async setTokens(tokens: AuthTokens): Promise<void> {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.tokenExpiry = tokens.expiresAt;

    // Only persist refresh token and expiry - access token stays in memory
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.TOKEN_EXPIRY, tokens.expiresAt.toString());
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.TOKEN_EXPIRY);
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    // Consider token expired 1 minute before actual expiry
    return Date.now() >= this.tokenExpiry - 60000;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        await this.clearTokens();
        return false;
      }

      const data = await response.json();
      await this.setTokens(data.tokens);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.clearTokens();
      return false;
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        return {};
      }
    }

    if (this.accessToken) {
      return { Authorization: `Bearer ${this.accessToken}` };
    }

    return {};
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, retryOnUnauthorized = true, ...fetchConfig } = config;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((fetchConfig.headers as Record<string, string>) || {}),
    };

    if (!skipAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchConfig,
        headers,
      });

      // Handle 401 with retry
      if (response.status === 401 && retryOnUnauthorized && !skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request<T>(endpoint, { ...config, retryOnUnauthorized: false });
        }
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Session expired. Please log in again.',
          },
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'API_ERROR',
            message: data.message || 'An error occurred',
            details: data.details,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect. Please check your internet connection.',
        },
      };
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.refreshToken;
  }

  // Get current access token (for debugging only)
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
