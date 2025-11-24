/**
 * Auth Types
 * Defines interfaces for authentication flows
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KYCStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'guest' | 'host' | 'both';

export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  requiresPhoneVerification: boolean;
}

export interface PhoneVerificationRequest {
  code: string;
}

export interface PhoneVerificationResponse {
  verified: boolean;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  emailSent: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}
