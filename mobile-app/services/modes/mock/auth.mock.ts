/**
 * Auth Mock Service
 * Mock implementation for development
 */

import { AuthService } from '@/services/auth';
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
  User,
  AuthTokens,
} from '@/types/auth';

// Simulated delay to mimic network latency
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data
const mockUser: User = {
  id: 'user_001',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+50371234567',
  role: 'guest',
  status: 'active',
  kycStatus: 'approved',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock tokens generator
const generateMockTokens = (): AuthTokens => ({
  accessToken: `mock_access_${Date.now()}`,
  refreshToken: `mock_refresh_${Date.now()}`,
  expiresAt: Date.now() + 3600000, // 1 hour from now
});

// Registered users store (in-memory for mock)
const registeredUsers = new Map<string, { user: User; password: string }>();

// Initialize with test user
registeredUsers.set('test@example.com', {
  user: mockUser,
  password: 'password123',
});

// Verification codes store
const verificationCodes = new Map<string, string>();

export const authMock: AuthService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    await delay(800);

    const userData = registeredUsers.get(request.email);

    if (!userData) {
      throw new Error('Invalid email or password');
    }

    if (userData.password !== request.password) {
      throw new Error('Invalid email or password');
    }

    return {
      user: userData.user,
      tokens: generateMockTokens(),
    };
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    await delay(1000);

    // Check if email already exists
    if (registeredUsers.has(request.email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      role: request.role,
      status: 'pending_verification',
      kycStatus: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registeredUsers.set(request.email, {
      user: newUser,
      password: request.password,
    });

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(newUser.id, code);
    console.log(`[MOCK] Verification code for ${request.phone}: ${code}`);

    return {
      user: newUser,
      tokens: generateMockTokens(),
      requiresPhoneVerification: true,
    };
  },

  async verifyPhone(request: PhoneVerificationRequest): Promise<PhoneVerificationResponse> {
    await delay(600);

    // For mock, accept code '123456' or any 6-digit code
    if (request.code.length !== 6) {
      throw new Error('Invalid verification code');
    }

    // Accept '123456' as always valid for testing
    if (request.code !== '123456' && !request.code.match(/^\d{6}$/)) {
      throw new Error('Invalid verification code');
    }

    return {
      verified: true,
      user: { ...mockUser, status: 'active' },
    };
  },

  async resendVerificationCode(): Promise<{ sent: boolean }> {
    await delay(500);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK] New verification code: ${code}`);

    return { sent: true };
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    await delay(700);

    // Always return success for mock
    console.log(`[MOCK] Password reset email sent to: ${request.email}`);

    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
      emailSent: true,
    };
  },

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    await delay(600);

    // For mock, accept any valid token format
    if (!request.token || request.token.length < 10) {
      throw new Error('Invalid or expired reset token');
    }

    if (request.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    return {
      success: true,
      message: 'Password has been reset successfully',
    };
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    await delay(300);

    if (!refreshToken || !refreshToken.startsWith('mock_refresh_')) {
      throw new Error('Invalid refresh token');
    }

    return {
      tokens: generateMockTokens(),
    };
  },

  async logout(): Promise<void> {
    await delay(200);
    // In mock, just return success
  },

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    await delay(400);

    return {
      available: !registeredUsers.has(email),
    };
  },

  async checkPhoneAvailability(phone: string): Promise<{ available: boolean }> {
    await delay(400);

    // For mock, always available unless it's a specific test number
    const unavailablePhones = ['+50370000000', '+50399999999'];

    return {
      available: !unavailablePhones.includes(phone),
    };
  },
};
