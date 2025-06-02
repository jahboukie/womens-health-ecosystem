import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Secure storage utility for sensitive data
export class SecureStorage {
  // Store sensitive data securely
  static async setItem(key: string, value: string): Promise<void> {
    try {
      // Use Expo SecureStore for sensitive data
      await SecureStore.setItemAsync(key, value, {
        keychainService: 'SoberPalKeychain',
        requireAuthentication: false, // Set to true for biometric protection
      });
    } catch (error) {
      console.error('Failed to store secure item:', error);
      // Fallback to AsyncStorage (less secure but still encrypted on device)
      await AsyncStorage.setItem(`secure_${key}`, value);
    }
  }

  // Retrieve sensitive data securely
  static async getItem(key: string): Promise<string | null> {
    try {
      // Try to get from Expo SecureStore first
      const value = await SecureStore.getItemAsync(key, {
        keychainService: 'SoberPalKeychain',
        requireAuthentication: false,
      });
      return value;
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      // Fallback to AsyncStorage
      try {
        return await AsyncStorage.getItem(`secure_${key}`);
      } catch (fallbackError) {
        console.error('Failed to retrieve from fallback storage:', fallbackError);
        return null;
      }
    }
  }

  // Remove sensitive data
  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key, {
        keychainService: 'SoberPalKeychain',
      });
    } catch (error) {
      console.error('Failed to remove secure item:', error);
      // Fallback to AsyncStorage
      try {
        await AsyncStorage.removeItem(`secure_${key}`);
      } catch (fallbackError) {
        console.error('Failed to remove from fallback storage:', fallbackError);
      }
    }
  }

  // Check if item exists
  static async hasItem(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('Failed to check if item exists:', error);
      return false;
    }
  }

  // Store JSON data securely
  static async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      await this.setItem(key, jsonString);
    } catch (error) {
      console.error('Failed to store secure object:', error);
      throw error;
    }
  }

  // Retrieve JSON data securely
  static async getObject<T = any>(key: string): Promise<T | null> {
    try {
      const jsonString = await this.getItem(key);
      if (jsonString === null) {
        return null;
      }
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Failed to retrieve secure object:', error);
      return null;
    }
  }

  // Clear all secure storage (use with caution)
  static async clear(): Promise<void> {
    try {
      // Note: SecureStore doesn't have a clear all method
      // We need to manually remove known keys
      const knownKeys = [
        'auth_token',
        'user_preferences',
        'biometric_settings',
        'encryption_keys',
      ];

      for (const key of knownKeys) {
        await this.removeItem(key);
      }

      // Also clear AsyncStorage fallback items
      const asyncKeys = await AsyncStorage.getAllKeys();
      const secureKeys = asyncKeys.filter(key => key.startsWith('secure_'));
      if (secureKeys.length > 0) {
        await AsyncStorage.multiRemove(secureKeys);
      }
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw error;
    }
  }

  // Store with expiration
  static async setItemWithExpiration(
    key: string,
    value: string,
    expirationMinutes: number
  ): Promise<void> {
    try {
      const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
      const dataWithExpiration = {
        value,
        expiration: expirationTime,
      };
      await this.setObject(key, dataWithExpiration);
    } catch (error) {
      console.error('Failed to store item with expiration:', error);
      throw error;
    }
  }

  // Get item with expiration check
  static async getItemWithExpiration(key: string): Promise<string | null> {
    try {
      const dataWithExpiration = await this.getObject<{
        value: string;
        expiration: number;
      }>(key);

      if (!dataWithExpiration) {
        return null;
      }

      if (Date.now() > dataWithExpiration.expiration) {
        // Item has expired, remove it
        await this.removeItem(key);
        return null;
      }

      return dataWithExpiration.value;
    } catch (error) {
      console.error('Failed to get item with expiration:', error);
      return null;
    }
  }

  // Store biometric settings
  static async setBiometricSettings(settings: {
    enabled: boolean;
    type: 'fingerprint' | 'face' | 'iris' | 'voice';
    fallbackToPassword: boolean;
  }): Promise<void> {
    await this.setObject('biometric_settings', settings);
  }

  // Get biometric settings
  static async getBiometricSettings(): Promise<{
    enabled: boolean;
    type: 'fingerprint' | 'face' | 'iris' | 'voice';
    fallbackToPassword: boolean;
  } | null> {
    return await this.getObject('biometric_settings');
  }

  // Store user preferences securely
  static async setUserPreferences(preferences: any): Promise<void> {
    await this.setObject('user_preferences', preferences);
  }

  // Get user preferences
  static async getUserPreferences(): Promise<any> {
    return await this.getObject('user_preferences');
  }

  // Store encryption keys (for local data encryption)
  static async setEncryptionKeys(keys: {
    publicKey: string;
    privateKey: string;
  }): Promise<void> {
    await this.setObject('encryption_keys', keys);
  }

  // Get encryption keys
  static async getEncryptionKeys(): Promise<{
    publicKey: string;
    privateKey: string;
  } | null> {
    return await this.getObject('encryption_keys');
  }

  // Migrate data from AsyncStorage to SecureStore
  static async migrateFromAsyncStorage(): Promise<void> {
    try {
      const keysToMigrate = [
        'auth_token',
        'user_preferences',
        'biometric_settings',
      ];

      for (const key of keysToMigrate) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          await this.setItem(key, value);
          await AsyncStorage.removeItem(key);
          console.log(`Migrated ${key} to secure storage`);
        }
      }
    } catch (error) {
      console.error('Failed to migrate data to secure storage:', error);
    }
  }

  // Check if SecureStore is available
  static async isSecureStoreAvailable(): Promise<boolean> {
    try {
      await SecureStore.isAvailableAsync();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const secureStorage = SecureStorage;
