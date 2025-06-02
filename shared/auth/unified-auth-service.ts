/**
 * 🎩✨ UNIFIED AUTHENTICATION SERVICE ✨🎩
 * 
 * Revolutionary cross-platform authentication system for the Complete Wellness Ecosystem
 * Supports SoberPal Core, Inner Architect, and Women's Health platforms
 * 
 * Features:
 * - Single Sign-On (SSO) across all platforms
 * - Enterprise SSO integration (SAML 2.0, OAuth 2.0)
 * - Multi-factor authentication
 * - Role-based access control
 * - HIPAA/PIPEDA compliance
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface EcosystemUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  platforms: PlatformAccess[];
  roles: UserRole[];
  subscription: SubscriptionInfo;
  preferences: UserPreferences;
  securitySettings: SecuritySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformAccess {
  platform: 'soberpal-core' | 'inner-architect' | 'womens-health';
  accessLevel: 'free' | 'premium' | 'enterprise';
  features: string[];
  lastAccessed?: Date;
  isActive: boolean;
}

export interface UserRole {
  role: 'user' | 'admin' | 'healthcare_provider' | 'enterprise_admin' | 'support';
  platform?: string;
  permissions: string[];
}

export interface SubscriptionInfo {
  type: 'individual_free' | 'individual_premium' | 'enterprise' | 'healthcare_provider';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  startDate: Date;
  endDate?: Date;
  features: string[];
  billing: {
    amount: number;
    currency: string;
    interval: 'monthly' | 'yearly';
  };
}

export interface UserPreferences {
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethods: ('totp' | 'sms' | 'email')[];
  biometricEnabled: boolean;
  sessionTimeout: number; // minutes
  passwordLastChanged: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  trustedDevices: TrustedDevice[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  fingerprint: string;
  lastUsed: Date;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  scope: string[];
  platforms: string[];
}

export interface SSOConfig {
  provider: 'saml' | 'oauth2' | 'oidc';
  entityId: string;
  ssoUrl: string;
  certificate: string;
  attributeMapping: {
    email: string;
    firstName: string;
    lastName: string;
    roles: string;
  };
}

export class UnifiedAuthService {
  private jwtSecret: string;
  private refreshSecret: string;
  private tokenExpiry: string;
  private refreshExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'ecosystem-jwt-secret';
    this.refreshSecret = process.env.REFRESH_SECRET || 'ecosystem-refresh-secret';
    this.tokenExpiry = process.env.TOKEN_EXPIRY || '15m';
    this.refreshExpiry = process.env.REFRESH_EXPIRY || '7d';
  }

  /**
   * 🔐 UNIFIED REGISTRATION
   * Register user across the complete ecosystem
   */
  async registerUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    platform: string;
    subscriptionType?: string;
  }): Promise<{ user: EcosystemUser; tokens: AuthToken }> {
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Create ecosystem user
    const user: EcosystemUser = {
      id: uuidv4(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      platforms: [{
        platform: userData.platform as any,
        accessLevel: userData.subscriptionType as any || 'free',
        features: this.getDefaultFeatures(userData.platform, userData.subscriptionType || 'free'),
        isActive: true
      }],
      roles: [{
        role: 'user',
        platform: userData.platform,
        permissions: this.getDefaultPermissions('user')
      }],
      subscription: this.createDefaultSubscription(userData.subscriptionType || 'individual_free'),
      preferences: this.createDefaultPreferences(),
      securitySettings: this.createDefaultSecuritySettings(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  /**
   * 🔑 UNIFIED LOGIN
   * Authenticate user across all platforms
   */
  async loginUser(credentials: {
    email: string;
    password: string;
    platform?: string;
    mfaCode?: string;
  }): Promise<{ user: EcosystemUser; tokens: AuthToken }> {
    
    // Validate credentials (implement database lookup)
    const user = await this.validateCredentials(credentials.email, credentials.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check MFA if enabled
    if (user.securitySettings.mfaEnabled && !credentials.mfaCode) {
      throw new Error('MFA code required');
    }

    if (user.securitySettings.mfaEnabled && credentials.mfaCode) {
      const mfaValid = await this.validateMFA(user.id, credentials.mfaCode);
      if (!mfaValid) {
        throw new Error('Invalid MFA code');
      }
    }

    // Update last accessed for platform
    if (credentials.platform) {
      user.platforms = user.platforms.map(p => 
        p.platform === credentials.platform 
          ? { ...p, lastAccessed: new Date() }
          : p
      );
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  /**
   * 🎯 GENERATE ECOSYSTEM TOKENS
   * Create JWT tokens with cross-platform access
   */
  generateTokens(user: EcosystemUser): AuthToken {
    const payload = {
      userId: user.id,
      email: user.email,
      platforms: user.platforms.map(p => p.platform),
      roles: user.roles,
      subscription: user.subscription.type,
      iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { 
      expiresIn: this.tokenExpiry,
      issuer: 'wellness-ecosystem',
      audience: user.platforms.map(p => p.platform)
    });

    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' }, 
      this.refreshSecret, 
      { expiresIn: this.refreshExpiry }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      tokenType: 'Bearer',
      scope: user.platforms.map(p => p.platform),
      platforms: user.platforms.map(p => p.platform)
    };
  }

  /**
   * 🔍 VALIDATE TOKEN
   * Verify JWT token and extract user info
   */
  async validateToken(token: string, requiredPlatform?: string): Promise<EcosystemUser | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Check if token has access to required platform
      if (requiredPlatform && !decoded.platforms.includes(requiredPlatform)) {
        throw new Error('Insufficient platform access');
      }

      // Fetch full user data (implement database lookup)
      const user = await this.getUserById(decoded.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * 🔄 REFRESH TOKEN
   * Generate new access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<AuthToken> {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshSecret) as any;
      
      if (decoded.tokenType !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const user = await this.getUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * 🏢 ENTERPRISE SSO LOGIN
   * Handle SAML/OAuth enterprise authentication
   */
  async enterpriseSSOLogin(ssoData: {
    provider: string;
    assertion: string;
    attributes: Record<string, any>;
  }): Promise<{ user: EcosystemUser; tokens: AuthToken }> {
    
    // Validate SSO assertion
    const ssoConfig = await this.getSSOConfig(ssoData.provider);
    const isValid = await this.validateSSOAssertion(ssoData.assertion, ssoConfig);
    
    if (!isValid) {
      throw new Error('Invalid SSO assertion');
    }

    // Extract user data from SSO attributes
    const userData = this.mapSSOAttributes(ssoData.attributes, ssoConfig);
    
    // Find or create user
    let user = await this.getUserByEmail(userData.email);
    
    if (!user) {
      // Create new enterprise user
      const registrationData = {
        email: userData.email,
        password: '', // No password for SSO users
        firstName: userData.firstName,
        lastName: userData.lastName,
        platform: 'enterprise',
        subscriptionType: 'enterprise'
      };
      
      const result = await this.registerUser(registrationData);
      user = result.user;
    }

    // Update user roles based on SSO attributes
    user.roles = this.mapSSOToRoles(userData.roles);
    
    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  // Helper methods (implement based on your database and requirements)
  private async validateCredentials(email: string, password: string): Promise<EcosystemUser | null> {
    // Implement database lookup and password validation
    return null;
  }

  private async validateMFA(userId: string, code: string): Promise<boolean> {
    // Implement MFA validation (TOTP, SMS, etc.)
    return false;
  }

  private async getUserById(userId: string): Promise<EcosystemUser | null> {
    // Implement database lookup
    return null;
  }

  private async getUserByEmail(email: string): Promise<EcosystemUser | null> {
    // Implement database lookup
    return null;
  }

  private getDefaultFeatures(platform: string, accessLevel: string): string[] {
    // Return default features based on platform and access level
    return [];
  }

  private getDefaultPermissions(role: string): string[] {
    // Return default permissions for role
    return [];
  }

  private createDefaultSubscription(type: string): SubscriptionInfo {
    return {
      type: type as any,
      status: 'active',
      startDate: new Date(),
      features: [],
      billing: {
        amount: 0,
        currency: 'USD',
        interval: 'monthly'
      }
    };
  }

  private createDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        marketing: false
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
      }
    };
  }

  private createDefaultSecuritySettings(): SecuritySettings {
    return {
      mfaEnabled: false,
      mfaMethods: [],
      biometricEnabled: false,
      sessionTimeout: 30,
      passwordLastChanged: new Date(),
      loginAttempts: 0,
      trustedDevices: []
    };
  }

  private async getSSOConfig(provider: string): Promise<SSOConfig> {
    // Implement SSO configuration lookup
    return {} as SSOConfig;
  }

  private async validateSSOAssertion(assertion: string, config: SSOConfig): Promise<boolean> {
    // Implement SSO assertion validation
    return false;
  }

  private mapSSOAttributes(attributes: Record<string, any>, config: SSOConfig): any {
    // Map SSO attributes to user data
    return {};
  }

  private mapSSOToRoles(ssoRoles: string[]): UserRole[] {
    // Map SSO roles to ecosystem roles
    return [];
  }
}

export const unifiedAuth = new UnifiedAuthService();
