/**
 * Auth Service Interface
 * Defines the contract for authentication operations
 */

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

export interface AuthService {
  /**
   * Login with email and password
   */
  login(request: LoginRequest): Promise<LoginResponse>;

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Promise<RegisterResponse>;

  /**
   * Verify phone number with OTP code
   */
  verifyPhone(request: PhoneVerificationRequest): Promise<PhoneVerificationResponse>;

  /**
   * Resend phone verification code
   */
  resendVerificationCode(): Promise<{ sent: boolean }>;

  /**
   * Request password reset email
   */
  forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;

  /**
   * Reset password with token
   */
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;

  /**
   * Logout user
   */
  logout(): Promise<void>;

  /**
   * Check if email is available
   */
  checkEmailAvailability(email: string): Promise<{ available: boolean }>;

  /**
   * Check if phone is available
   */
  checkPhoneAvailability(phone: string): Promise<{ available: boolean }>;
}
