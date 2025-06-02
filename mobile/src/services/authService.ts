import { ApiClient } from './apiClient';
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';
import { secureStorage } from '../utils/secureStorage';
import { deviceInfo } from '../utils/deviceInfo';

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<{
    user: User;
    token: string;
  }> {
    const deviceData = await deviceInfo.getDeviceInfo();
    
    const response = await ApiClient.post<{
      user: User;
      token: string;
    }>('/auth/login', {
      ...credentials,
      deviceInfo: {
        ...credentials.deviceInfo,
        ...deviceData,
      },
    });

    if (response.success && response.data) {
      // Store token securely
      await secureStorage.setItem('auth_token', response.data.token);
      
      // Set token in API client
      ApiClient.setAuthToken(response.data.token);
      
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  // Register user
  static async register(userData: RegisterData): Promise<{
    user: User;
    token: string;
  }> {
    const deviceData = await deviceInfo.getDeviceInfo();
    
    const response = await ApiClient.post<{
      user: User;
      token: string;
    }>('/auth/register', {
      ...userData,
      deviceInfo: deviceData,
    });

    if (response.success && response.data) {
      // Store token securely
      await secureStorage.setItem('auth_token', response.data.token);
      
      // Set token in API client
      ApiClient.setAuthToken(response.data.token);
      
      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - for server-side cleanup)
      await ApiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn('Logout API call failed:', error);
    }

    // Clear local storage
    await secureStorage.removeItem('auth_token');
    
    // Clear token from API client
    ApiClient.clearAuthToken();
  }

  // Refresh token
  static async refreshToken(currentToken: string): Promise<{
    user: User;
    token: string;
  }> {
    const response = await ApiClient.post<{
      user: User;
      token: string;
    }>('/auth/refresh', {
      token: currentToken,
    });

    if (response.success && response.data) {
      // Store new token securely
      await secureStorage.setItem('auth_token', response.data.token);
      
      // Set new token in API client
      ApiClient.setAuthToken(response.data.token);
      
      return response.data;
    }

    throw new Error(response.error || 'Token refresh failed');
  }

  // Verify token
  static async verifyToken(token: string): Promise<{
    user: User;
  }> {
    // Set token for this request
    ApiClient.setAuthToken(token);
    
    const response = await ApiClient.get<{
      user: User;
    }>('/auth/verify');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Token verification failed');
  }

  // Update user profile
  static async updateProfile(profileData: Partial<User>): Promise<{
    user: User;
  }> {
    const response = await ApiClient.patch<{
      user: User;
    }>('/user/profile', profileData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Profile update failed');
  }

  // Update user preferences
  static async updatePreferences(preferences: Partial<User['preferences']>): Promise<{
    message: string;
  }> {
    const response = await ApiClient.patch<{
      message: string;
    }>('/user/preferences', preferences);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Preferences update failed');
  }

  // Get user profile
  static async getProfile(): Promise<User> {
    const response = await ApiClient.get<User>('/user/profile');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get profile');
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    daysSinceJoined: number;
    daysSober: number;
    conversationCount: number;
    journalEntryCount: number;
    milestoneCount: number;
    lastActive: Date;
  }> {
    const response = await ApiClient.get<{
      daysSinceJoined: number;
      daysSober: number;
      conversationCount: number;
      journalEntryCount: number;
      milestoneCount: number;
      lastActive: Date;
    }>('/user/stats');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get user statistics');
  }

  // Delete user account
  static async deleteAccount(): Promise<void> {
    const response = await ApiClient.delete('/user/account');

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }

    // Clear local storage after successful deletion
    await secureStorage.removeItem('auth_token');
    ApiClient.clearAuthToken();
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<{
    message: string;
  }> {
    const response = await ApiClient.post<{
      message: string;
    }>('/auth/forgot-password', { email });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to send password reset email');
  }

  // Reset password
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{
    message: string;
  }> {
    const response = await ApiClient.post<{
      message: string;
    }>('/auth/reset-password', {
      token,
      password: newPassword,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to reset password');
  }

  // Change password
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{
    message: string;
  }> {
    const response = await ApiClient.post<{
      message: string;
    }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to change password');
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await secureStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      await this.verifyToken(token);
      return true;
    } catch (error) {
      // Clear invalid token
      await secureStorage.removeItem('auth_token');
      ApiClient.clearAuthToken();
      return false;
    }
  }

  // Get stored auth token
  static async getStoredToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem('auth_token');
    } catch (error) {
      console.warn('Failed to get stored token:', error);
      return null;
    }
  }
}

export const authService = AuthService;
