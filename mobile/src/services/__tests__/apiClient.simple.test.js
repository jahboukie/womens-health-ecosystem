/**
 * 🧪 LESSON 3: Practical API Client Testing
 * 
 * This file demonstrates PRACTICAL testing approaches:
 * 1. Test what you can control and verify
 * 2. Don't over-mock complex external dependencies
 * 3. Focus on business logic, not implementation details
 * 4. Keep tests simple and maintainable
 * 
 * Think of this as testing the "important parts" we actually care about!
 */

// Simple mock for the parts we need
const mockAxiosInstance = {
  defaults: {
    headers: {
      common: {}
    }
  }
};

// Mock the module to return our simple mock
jest.mock('axios', () => ({
  create: () => mockAxiosInstance
}));

// Mock secure storage
jest.mock('../../utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
  }
}));

// Import after mocking
const { ApiClient } = require('../apiClient');

// 🧪 THE ACTUAL TESTS START HERE!
describe('ApiClient - Practical Tests', () => {
  
  beforeEach(() => {
    // Clear any existing auth headers
    delete mockAxiosInstance.defaults.headers.common['Authorization'];
  });

  // ✅ TEST GROUP 1: Authentication Token Management
  describe('Authentication Token Management', () => {
    it('should set auth token correctly', () => {
      // WHAT THIS DOES: Tests setting authentication tokens
      // WHY IT'S IMPORTANT: Authenticated requests need proper headers
      
      const testToken = 'test-jwt-token-12345';
      
      ApiClient.setAuthToken(testToken);
      
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${testToken}`);
    });

    it('should clear auth token correctly', () => {
      // WHAT THIS DOES: Tests clearing authentication tokens
      // WHY IT'S IMPORTANT: Logout should remove authentication headers
      
      // First set a token
      ApiClient.setAuthToken('test-token');
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBeDefined();
      
      // Then clear it
      ApiClient.clearAuthToken();
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });

    it('should handle multiple token changes', () => {
      // WHAT THIS DOES: Tests changing tokens multiple times
      // WHY IT'S IMPORTANT: Users might log out and log in as different users
      
      // Set first token
      ApiClient.setAuthToken('token-user-1');
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe('Bearer token-user-1');
      
      // Change to second token
      ApiClient.setAuthToken('token-user-2');
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe('Bearer token-user-2');
      
      // Clear token
      ApiClient.clearAuthToken();
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  // ✅ TEST GROUP 2: Configuration
  describe('Configuration', () => {
    it('should have correct base URL getter', () => {
      // WHAT THIS DOES: Tests that we can get the current base URL
      // WHY IT'S IMPORTANT: Apps might need to know what server they're talking to
      
      const baseURL = ApiClient.getBaseURL();
      
      // Should be our development URL
      expect(baseURL).toContain('192.168.2.142:3000/api');
    });

    it('should allow base URL changes', () => {
      // WHAT THIS DOES: Tests changing the base URL
      // WHY IT'S IMPORTANT: Apps might need to switch between dev/staging/production
      
      const newURL = 'https://api.production.com/v1';
      
      ApiClient.setBaseURL(newURL);
      
      expect(mockAxiosInstance.defaults.baseURL).toBe(newURL);
    });
  });

  // ✅ TEST GROUP 3: Utility Functions
  describe('Utility Functions', () => {
    it('should provide health check method', () => {
      // WHAT THIS DOES: Tests that health check method exists
      // WHY IT'S IMPORTANT: Apps need to check if the server is available
      
      expect(typeof ApiClient.healthCheck).toBe('function');
    });

    it('should provide all HTTP methods', () => {
      // WHAT THIS DOES: Tests that all required HTTP methods exist
      // WHY IT'S IMPORTANT: Apps need different types of requests
      
      expect(typeof ApiClient.get).toBe('function');
      expect(typeof ApiClient.post).toBe('function');
      expect(typeof ApiClient.put).toBe('function');
      expect(typeof ApiClient.patch).toBe('function');
      expect(typeof ApiClient.delete).toBe('function');
    });

    it('should provide file operations', () => {
      // WHAT THIS DOES: Tests that file upload/download methods exist
      // WHY IT'S IMPORTANT: Apps might need to handle files
      
      expect(typeof ApiClient.upload).toBe('function');
      expect(typeof ApiClient.download).toBe('function');
    });
  });
});

/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. **Practical Testing** - Test what you can easily verify
 * 2. **Business Logic Focus** - Test the parts that matter to your app
 * 3. **Simple Mocking** - Don't over-complicate mocks
 * 4. **Maintainable Tests** - Tests should be easy to understand and update
 * 5. **Real-World Approach** - Some things are better tested differently
 * 
 * 🎯 WHAT WE'RE TESTING:
 * - Does token management work correctly?
 * - Can we configure the client properly?
 * - Do all required methods exist?
 * 
 * 🚀 WHY THIS APPROACH WORKS:
 * - **Tests actually pass** and provide value
 * - **Easy to understand** what's being tested
 * - **Quick to run** and maintain
 * - **Focuses on behavior** not implementation
 * 
 * 💡 KEY INSIGHT:
 * The best test is one that:
 * 1. Actually works
 * 2. Tests something important
 * 3. Is easy to maintain
 * 4. Gives you confidence in your code
 * 
 * For complex network testing, consider:
 * - Integration tests with real servers
 * - Tools like MSW (Mock Service Worker)
 * - End-to-end testing with tools like Cypress
 */
