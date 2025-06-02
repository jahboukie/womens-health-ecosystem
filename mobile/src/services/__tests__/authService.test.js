/**
 * 🧪 LESSON 2: Testing Authentication Service
 *
 * This file tests our AuthService to make sure:
 * 1. Login works correctly with valid credentials
 * 2. Login fails gracefully with invalid credentials
 * 3. Token storage and retrieval works
 * 4. Error handling works properly
 * 5. Network failures are handled correctly
 *
 * Think of this as testing the "brain" of our authentication system!
 */
// 🎭 MOCK DEPENDENCIES: We'll simulate external services
const mockApiClient = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn()};
const mockSecureStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn()};
const mockDeviceInfo = {
  getDeviceInfo: jest.fn()};
// Mock the imports before importing AuthService
jest.mock('../apiClient', () => ({
  ApiClient: mockApiClient}));
jest.mock('../../utils/secureStorage', () => ({
  secureStorage: mockSecureStorage}));
jest.mock('../../utils/deviceInfo', () => ({
  deviceInfo: mockDeviceInfo}));
// Now import the service we want to test
const { AuthService } = require('../authService');
// 🧪 THE ACTUAL TESTS START HERE!
describe('AuthService', () => {
  // 🧹 CLEANUP: Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock responses
    mockDeviceInfo.getDeviceInfo.mockResolvedValue({
      platform: 'ios',
      version: '1.0.0',
      deviceId: 'test-device-123'
    });
  });
  // ✅ TEST GROUP 1: Login functionality
  describe('login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123',
      deviceInfo: { platform: 'ios' }
    };
    const mockLoginResponse = {
      success: true,
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          timezone: 'UTC'
        },
        token: 'mock-jwt-token-12345'
      }
    };
    it('should login successfully with valid credentials', async () => {
      // WHAT THIS DOES: Tests successful login flow
      // WHY IT'S IMPORTANT: Users need to be able to log in!
      // 🎭 ARRANGE: Set up our mock responses
      mockApiClient.post.mockResolvedValue(mockLoginResponse);
      mockSecureStorage.setItem.mockResolvedValue(undefined);
      // 🎬 ACT: Call the function we're testing
      const result = await AuthService.login(validCredentials);
      // 🔍 ASSERT: Check that everything worked correctly
      expect(result).toEqual(mockLoginResponse.data);
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
        deviceInfo: {
          platform: 'ios',
          version: '1.0.0',
          deviceId: 'test-device-123'
        }
      });
      expect(mockSecureStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token-12345');
      expect(mockApiClient.setAuthToken).toHaveBeenCalledWith('mock-jwt-token-12345');
    });
    it('should handle login failure gracefully', async () => {
      // WHAT THIS DOES: Tests what happens when login fails
      // WHY IT'S IMPORTANT: Users should get clear error messages
      const failureResponse = {
        success: false,
        error: 'Invalid credentials'
      };
      mockApiClient.post.mockResolvedValue(failureResponse);
      // 🎬 ACT & ASSERT: Expect the function to throw an error
      await expect(AuthService.login(validCredentials)).rejects.toThrow('Invalid credentials');
      // Make sure we didn't store anything when login failed
      expect(mockSecureStorage.setItem).not.toHaveBeenCalled();
      expect(mockApiClient.setAuthToken).not.toHaveBeenCalled();
    });
    it('should handle network errors during login', async () => {
      // WHAT THIS DOES: Tests what happens when the network fails
      // WHY IT'S IMPORTANT: Apps should work gracefully when offline
      mockApiClient.post.mockRejectedValue(new Error('Network error'));
      await expect(AuthService.login(validCredentials)).rejects.toThrow('Network error');
      // Make sure we didn't store anything when network failed
      expect(mockSecureStorage.setItem).not.toHaveBeenCalled();
    });
  });
  // ✅ TEST GROUP 2: Token verification
  describe('verifyToken', () => {
    it('should verify valid token successfully', async () => {
      // WHAT THIS DOES: Tests token verification
      // WHY IT'S IMPORTANT: We need to know if stored tokens are still valid
      const mockVerifyResponse = {
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com'
          }
        }
      };
      mockApiClient.get.mockResolvedValue(mockVerifyResponse);
      const result = await AuthService.verifyToken('valid-token');
      expect(result).toEqual(mockVerifyResponse.data);
      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/verify');
    });
    it('should handle invalid token', async () => {
      // WHAT THIS DOES: Tests what happens with expired/invalid tokens
      // WHY IT'S IMPORTANT: Invalid tokens should be rejected cleanly
      const invalidTokenResponse = {
        success: false,
        error: 'Token expired'
      };
      mockApiClient.get.mockResolvedValue(invalidTokenResponse);
      await expect(AuthService.verifyToken('invalid-token')).rejects.toThrow('Token expired');
    });
  });
  // ✅ TEST GROUP 3: Authentication status checking
  describe('isAuthenticated', () => {
    it('should return true for valid stored token', async () => {
      // WHAT THIS DOES: Tests if user is currently authenticated
      // WHY IT'S IMPORTANT: App needs to know if user is logged in
      mockSecureStorage.getItem.mockResolvedValue('valid-token');
      mockApiClient.get.mockResolvedValue({
        success: true,
        data: { user: { id: 'user-123' } }
      });
      const result = await AuthService.isAuthenticated();
      expect(result).toBe(true);
      expect(mockSecureStorage.getItem).toHaveBeenCalledWith('auth_token');
    });
    it('should return false when no token stored', async () => {
      // WHAT THIS DOES: Tests behavior when user is not logged in
      // WHY IT'S IMPORTANT: App should handle logged-out state
      mockSecureStorage.getItem.mockResolvedValue(null);
      const result = await AuthService.isAuthenticated();
      expect(result).toBe(false);
    });
    it('should return false and clear invalid token', async () => {
      // WHAT THIS DOES: Tests cleanup of invalid tokens
      // WHY IT'S IMPORTANT: Bad tokens should be removed automatically
      mockSecureStorage.getItem.mockResolvedValue('invalid-token');
      mockApiClient.get.mockResolvedValue({
        success: false,
        error: 'Token expired'
      });
      const result = await AuthService.isAuthenticated();
      expect(result).toBe(false);
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockApiClient.clearAuthToken).toHaveBeenCalled();
    });
  });
  // ✅ TEST GROUP 4: Logout functionality
  describe('logout', () => {
    it('should logout successfully', async () => {
      // WHAT THIS DOES: Tests logout process
      // WHY IT'S IMPORTANT: Users need to be able to log out securely
      mockApiClient.post.mockResolvedValue({ success: true });
      await AuthService.logout();
      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockSecureStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockApiClient.clearAuthToken).toHaveBeenCalled();
    });
  });
});
/**
 * 🎓 LEARNING NOTES:
 *
 * 1. **Mocking** - We simulate external dependencies (API, storage)
 * 2. **Arrange-Act-Assert** - Set up, execute, verify pattern
 * 3. **Edge Cases** - Test failures, network errors, invalid data
 * 4. **Isolation** - Each test is independent and clean
 * 5. **Descriptive Names** - Test names explain what they verify
 *
 * 🎯 WHAT WE'RE TESTING:
 * - Does login work with valid credentials?
 * - Are errors handled gracefully?
 * - Is token storage working correctly?
 * - Does authentication status checking work?
 * - Can users log out properly?
 *
 * 🚀 WHY THIS MATTERS:
 * Authentication is critical - these tests ensure users can:
 * - Log in reliably
 * - Stay logged in when they should
 * - Get logged out when tokens expire
 * - Receive clear error messages when things go wrong
 */
