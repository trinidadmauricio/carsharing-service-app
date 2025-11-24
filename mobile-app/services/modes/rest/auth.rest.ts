/**
 * Auth REST Service
 * Real API implementation for production
 */

import { AuthService } from '@/services/auth';
import { apiClient } from '@/services/apiClient';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenResponse,
} from '@/types/auth';

export const authRest: AuthService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', request, {
      skipAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Login failed');
    }

    // Set tokens in API client
    await apiClient.setTokens(response.data.tokens);

    return response.data;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', request, {
      skipAuth: true,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Registration failed');
    }

    // Set tokens in API client
    await apiClient.setTokens(response.data.tokens);

    return response.data;
  },

  async verifyPhone(request: PhoneVerificationRequest): Promise<PhoneVerificationResponse> {
    const response = await apiClient.post<PhoneVerificationResponse>(
      '/auth/verify-phone',
      request
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Verification failed');
    }

    return response.data;
  },

  async resendVerificationCode(): Promise<{ sent: boolean }> {
    const response = await apiClient.post<{ sent: boolean }>('/auth/resend-code');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Failed to resend code');
    }

    return response.data;
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(
      '/auth/forgot-password',
      request,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Request failed');
    }

    return response.data;
  },

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/auth/reset-password',
      request,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Password reset failed');
    }

    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Token refresh failed');
    }

    // Update tokens in API client
    await apiClient.setTokens(response.data.tokens);

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear tokens, even if logout request fails
      await apiClient.clearTokens();
    }
  },

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await apiClient.get<{ available: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Check failed');
    }

    return response.data;
  },

  async checkPhoneAvailability(phone: string): Promise<{ available: boolean }> {
    const response = await apiClient.get<{ available: boolean }>(
      `/auth/check-phone?phone=${encodeURIComponent(phone)}`,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? 'Check failed');
    }

    return response.data;
  },
};
