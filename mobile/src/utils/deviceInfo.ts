import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export class DeviceInfo {
  // Get comprehensive device information
  static async getDeviceInfo(): Promise<{
    deviceId: string;
    platform: 'ios' | 'android';
    appVersion: string;
    osVersion: string;
    model: string;
    brand: string;
    isDevice: boolean;
    isEmulator: boolean;
  }> {
    try {
      const deviceId = await this.getDeviceId();
      const appVersion = await this.getAppVersion();

      return {
        deviceId,
        platform: Platform.OS as 'ios' | 'android',
        appVersion,
        osVersion: Platform.Version.toString(),
        model: Device.modelName || 'Unknown',
        brand: Device.brand || 'Unknown',
        isDevice: Device.isDevice,
        isEmulator: !Device.isDevice,
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      return {
        deviceId: 'unknown',
        platform: Platform.OS as 'ios' | 'android',
        appVersion: '1.0.0',
        osVersion: Platform.Version.toString(),
        model: 'Unknown',
        brand: 'Unknown',
        isDevice: true,
        isEmulator: false,
      };
    }
  }

  // Get unique device identifier
  static async getDeviceId(): Promise<string> {
    try {
      // For iOS, use identifierForVendor
      if (Platform.OS === 'ios') {
        const iosId = await Application.getIosIdForVendorAsync();
        return iosId || Constants.sessionId || 'unknown';
      }

      // For Android, use Android ID
      if (Platform.OS === 'android') {
        return Application.getAndroidId() || Constants.sessionId;
      }

      // Fallback to session ID
      return Constants.sessionId;
    } catch (error) {
      console.error('Failed to get device ID:', error);
      return Constants.sessionId;
    }
  }

  // Get app version
  static async getAppVersion(): Promise<string> {
    try {
      return Application.nativeApplicationVersion || '1.0.0';
    } catch (error) {
      console.error('Failed to get app version:', error);
      return '1.0.0';
    }
  }

  // Get app build number
  static async getBuildNumber(): Promise<string> {
    try {
      return Application.nativeBuildVersion || '1';
    } catch (error) {
      console.error('Failed to get build number:', error);
      return '1';
    }
  }

  // Get device name
  static getDeviceName(): string {
    return Device.deviceName || 'Unknown Device';
  }

  // Get device type
  static getDeviceType(): string {
    switch (Device.deviceType) {
      case Device.DeviceType.PHONE:
        return 'phone';
      case Device.DeviceType.TABLET:
        return 'tablet';
      case Device.DeviceType.DESKTOP:
        return 'desktop';
      case Device.DeviceType.TV:
        return 'tv';
      default:
        return 'unknown';
    }
  }

  // Check if device is a tablet
  static isTablet(): boolean {
    return Device.deviceType === Device.DeviceType.TABLET;
  }

  // Check if device is a phone
  static isPhone(): boolean {
    return Device.deviceType === Device.DeviceType.PHONE;
  }

  // Get OS information
  static getOSInfo(): {
    name: string;
    version: string;
    platform: string;
  } {
    return {
      name: Platform.OS === 'ios' ? 'iOS' : 'Android',
      version: Platform.Version.toString(),
      platform: Platform.OS,
    };
  }

  // Get app bundle identifier
  static async getBundleId(): Promise<string> {
    try {
      return Application.applicationId || 'com.soberpal.app';
    } catch (error) {
      console.error('Failed to get bundle ID:', error);
      return 'com.soberpal.app';
    }
  }

  // Get installation ID (unique per app installation)
  static async getInstallationId(): Promise<string> {
    try {
      // Use installation time as a fallback since getInstallationIdAsync doesn't exist
      const installTime = await Application.getInstallationTimeAsync();
      return installTime.getTime().toString();
    } catch (error) {
      console.error('Failed to get installation ID:', error);
      return Constants.sessionId || 'unknown';
    }
  }

  // Check if app is running in development mode
  static isDevelopment(): boolean {
    return __DEV__;
  }

  // Check if app is running in Expo Go
  static isExpoGo(): boolean {
    return Constants.appOwnership === 'expo';
  }

  // Check if app is a standalone build
  static isStandalone(): boolean {
    return Constants.appOwnership === 'standalone';
  }

  // Get device memory information (if available)
  static getMemoryInfo(): {
    totalMemory?: number;
    availableMemory?: number;
  } {
    // Note: This information is limited on mobile platforms
    // You might need additional native modules for detailed memory info
    return {
      totalMemory: Device.totalMemory || undefined,
      availableMemory: undefined, // Not available in Expo
    };
  }

  // Get device orientation capabilities
  static getOrientationInfo(): {
    supportsPortrait: boolean;
    supportsLandscape: boolean;
  } {
    // This is a simplified check - you might want to use react-native-orientation-locker
    // for more detailed orientation information
    return {
      supportsPortrait: true,
      supportsLandscape: this.isTablet(), // Tablets typically support both
    };
  }

  // Get device security information
  static async getSecurityInfo(): Promise<{
    isRooted?: boolean;
    isJailbroken?: boolean;
    hasSecureHardware?: boolean;
  }> {
    // Note: Detecting rooted/jailbroken devices requires additional native modules
    // This is a placeholder for future implementation
    return {
      isRooted: undefined,
      isJailbroken: undefined,
      hasSecureHardware: undefined,
    };
  }

  // Create device fingerprint for security
  static async createDeviceFingerprint(): Promise<string> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      const installationId = await this.getInstallationId();

      const fingerprint = [
        deviceInfo.platform,
        deviceInfo.model,
        deviceInfo.osVersion,
        installationId,
        Constants.sessionId,
      ].join('|');

      // Create a simple hash of the fingerprint
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }

      return Math.abs(hash).toString(16);
    } catch (error) {
      console.error('Failed to create device fingerprint:', error);
      return 'unknown';
    }
  }

  // Get network information (basic)
  static getNetworkInfo(): {
    platform: string;
    userAgent: string;
  } {
    return {
      platform: Platform.OS,
      userAgent: `SoberPal/${Application.nativeApplicationVersion || '1.0.0'} (${Platform.OS} ${Platform.Version})`,
    };
  }

  // Log device information for debugging
  static async logDeviceInfo(): Promise<void> {
    if (__DEV__) {
      try {
        const deviceInfo = await this.getDeviceInfo();
        const installationId = await this.getInstallationId();
        const bundleId = await this.getBundleId();

        console.log('=== Device Information ===');
        console.log('Device ID:', deviceInfo.deviceId);
        console.log('Platform:', deviceInfo.platform);
        console.log('App Version:', deviceInfo.appVersion);
        console.log('OS Version:', deviceInfo.osVersion);
        console.log('Model:', deviceInfo.model);
        console.log('Brand:', deviceInfo.brand);
        console.log('Is Device:', deviceInfo.isDevice);
        console.log('Installation ID:', installationId);
        console.log('Bundle ID:', bundleId);
        console.log('Is Development:', this.isDevelopment());
        console.log('Is Expo Go:', this.isExpoGo());
        console.log('========================');
      } catch (error) {
        console.error('Failed to log device info:', error);
      }
    }
  }
}

export const deviceInfo = DeviceInfo;
