/**
 * 🔒 SECURITY PROVIDER COMPONENT
 * 
 * Provides security context and services to all web applications
 * Integrates military-grade security across the ecosystem
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

// Security Context
const SecurityContext = createContext();

// Security Service Class
class WebSecurityService {
  constructor() {
    this.encryptionKey = null;
    this.isInitialized = false;
    this.authToken = null;
    this.mfaEnabled = false;
  }

  async initialize() {
    try {
      this.encryptionKey = this.getOrCreateEncryptionKey();
      this.authToken = this.getAuthToken();
      this.mfaEnabled = this.getMFAStatus();
      this.isInitialized = true;
      
      console.log('🔒 Web Security Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Security initialization failed:', error);
      return false;
    }
  }

  // Client-side encryption before API calls
  encryptData(data) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }

  decryptData(encryptedData) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  // Secure API client with encryption
  async secureApiCall(endpoint, data = null, method = 'GET', options = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const url = `${baseUrl}/api${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Security-Level': 'MILITARY_GRADE',
      ...options.headers
    };

    // Add authentication if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Add MFA token if required
    if (options.mfaToken) {
      headers['X-MFA-Token'] = options.mfaToken;
      headers['X-MFA-Method'] = options.mfaMethod || 'totp';
    }

    let body = null;
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (options.encrypt !== false) {
        // Encrypt data before transmission
        const encryptedData = this.encryptData(data);
        headers['X-Encrypted'] = 'true';
        headers['X-Encryption-Key'] = this.getEncryptionKeyHash();
        body = JSON.stringify({ encryptedData });
      } else {
        body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Decrypt response if encrypted
      if (result.encryptedData && options.decrypt !== false) {
        return this.decryptData(result.encryptedData);
      }

      return result;
    } catch (error) {
      console.error('🚨 Secure API call failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.secureApiCall('/auth/login', credentials, 'POST');
      
      if (response.success && response.token) {
        this.setAuthToken(response.token);
        this.setUserData(response.user);
        
        // Log successful authentication
        this.logSecurityEvent('USER_LOGIN', 'SUCCESS', {
          userId: response.user.id,
          timestamp: new Date().toISOString()
        });
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Log failed authentication
      this.logSecurityEvent('USER_LOGIN', 'FAILED', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  async logout() {
    try {
      await this.secureApiCall('/auth/logout', null, 'POST');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
      this.logSecurityEvent('USER_LOGOUT', 'SUCCESS', {
        timestamp: new Date().toISOString()
      });
    }
  }

  // MFA methods
  async setupMFA(userId, userEmail) {
    try {
      const response = await this.secureApiCall('/auth/mfa/setup', {
        userId,
        userEmail
      }, 'POST');
      
      this.logSecurityEvent('MFA_SETUP', 'INITIATED', {
        userId,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      this.logSecurityEvent('MFA_SETUP', 'FAILED', {
        userId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  async verifyMFA(userId, token, secret) {
    try {
      const response = await this.secureApiCall('/auth/mfa/verify', {
        userId,
        token,
        secret
      }, 'POST');
      
      if (response.verified) {
        this.setMFAStatus(true);
        this.logSecurityEvent('MFA_VERIFICATION', 'SUCCESS', {
          userId,
          timestamp: new Date().toISOString()
        });
      }
      
      return response;
    } catch (error) {
      this.logSecurityEvent('MFA_VERIFICATION', 'FAILED', {
        userId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  // Storage methods
  getOrCreateEncryptionKey() {
    let key = localStorage.getItem('encryptionKey');
    if (!key) {
      key = CryptoJS.lib.WordArray.random(256/8).toString();
      localStorage.setItem('encryptionKey', key);
    }
    return key;
  }

  getEncryptionKeyHash() {
    return CryptoJS.SHA256(this.encryptionKey).toString().substring(0, 16);
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getMFAStatus() {
    return localStorage.getItem('mfaEnabled') === 'true';
  }

  setMFAStatus(enabled) {
    this.mfaEnabled = enabled;
    localStorage.setItem('mfaEnabled', enabled.toString());
  }

  clearAuthData() {
    this.authToken = null;
    this.mfaEnabled = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('mfaEnabled');
  }

  // Security logging
  logSecurityEvent(eventType, status, details) {
    const event = {
      eventType,
      status,
      details,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };
    
    // Store locally and send to server
    this.storeSecurityEvent(event);
    this.sendSecurityEventToServer(event);
  }

  storeSecurityEvent(event) {
    const events = JSON.parse(localStorage.getItem('securityEvents') || '[]');
    events.push(event);
    
    // Keep only last 100 events locally
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('securityEvents', JSON.stringify(events));
  }

  async sendSecurityEventToServer(event) {
    try {
      await this.secureApiCall('/security/events', event, 'POST', { encrypt: false });
    } catch (error) {
      console.warn('Failed to send security event to server:', error);
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = CryptoJS.lib.WordArray.random(128/8).toString();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Security status
  getSecurityStatus() {
    return {
      initialized: this.isInitialized,
      authenticated: !!this.authToken,
      mfaEnabled: this.mfaEnabled,
      encryptionActive: !!this.encryptionKey,
      securityLevel: 'MILITARY_GRADE'
    };
  }
}

// Security Provider Component
export const SecurityProvider = ({ children }) => {
  const [securityService] = useState(() => new WebSecurityService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      const initialized = await securityService.initialize();
      setIsInitialized(initialized);
      
      // Check authentication status
      const userData = securityService.getUserData();
      if (userData && securityService.authToken) {
        setIsAuthenticated(true);
        setUser(userData);
        setMfaEnabled(securityService.mfaEnabled);
      }
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  };

  const login = async (credentials) => {
    const response = await securityService.login(credentials);
    setIsAuthenticated(true);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await securityService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setMfaEnabled(false);
  };

  const setupMFA = async (userId, userEmail) => {
    return await securityService.setupMFA(userId, userEmail);
  };

  const verifyMFA = async (userId, token, secret) => {
    const response = await securityService.verifyMFA(userId, token, secret);
    if (response.verified) {
      setMfaEnabled(true);
    }
    return response;
  };

  const secureApiCall = async (endpoint, data, method, options) => {
    return await securityService.secureApiCall(endpoint, data, method, options);
  };

  const value = {
    // State
    isInitialized,
    isAuthenticated,
    user,
    mfaEnabled,
    
    // Methods
    login,
    logout,
    setupMFA,
    verifyMFA,
    secureApiCall,
    
    // Security service
    securityService,
    
    // Security status
    getSecurityStatus: () => securityService.getSecurityStatus()
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security Hook
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
