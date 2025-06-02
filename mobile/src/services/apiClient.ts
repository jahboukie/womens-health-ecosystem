import axios from 'axios';
// Define types locally since they may not be exported in this version
type AxiosInstance = any;
type AxiosRequestConfig = any;
type AxiosResponse = any;
import { ApiResponse } from '../types';
import { secureStorage } from '../utils/secureStorage';
// API configuration - Updated to match our backend
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.soberpal.health/api';
const API_TIMEOUT = 30000; // 30 seconds
// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'}});
// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await secureStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful requests in development
    if (__DEV__) {
      const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    }
    return response;
  },
  async (error: any) => {
    // Log errors in development
    if (__DEV__) {
      const duration = error.config?.metadata?.startTime
        ? new Date().getTime() - error.config.metadata.startTime.getTime()
        : 0;
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`);
    }
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          await secureStorage.removeItem('auth_token');
          // You might want to dispatch a logout action here
          break;
        case 403:
          // Forbidden - user doesn't have permission
          break;
        case 404:
          // Not found
          break;
        case 429:
          // Rate limited
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          break;
      }
      // Return formatted error
      return Promise.reject({
        message: data?.error || data?.message || 'An error occurred',
        status: status,
        code: data?.code,
        details: data?.details});
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR'});
    } else {
      // Other error
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR'});
    }
  }
);
// API client methods
export class ApiClient {
  // GET request
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get(url, config);
    return response.data;
  }
  // POST request
  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post(url, data, config);
    return response.data;
  }
  // PUT request
  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put(url, data, config);
    return response.data;
  }
  // PATCH request
  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  }
  // DELETE request
  static async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.delete(url, config);
    return response.data;
  }
  // Upload file
  static async upload<T = any>(
    url: string,
    file: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'},
      onUploadProgress});
    return response.data;
  }
  // Download file
  static async download(
    url: string,
    filename?: string
  ): Promise<Blob> {
    const response = await apiClient.get(url, {
      responseType: 'blob'});
    // Create download link if filename is provided
    if (filename) {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    }
    return response.data;
  }
  // Health check
  static async healthCheck(): Promise<any> {
    const response = await apiClient.get('/health');
    return response.data;
  }
  // Set auth token
  static setAuthToken(token: string): void {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  // Clear auth token
  static clearAuthToken(): void {
    delete apiClient.defaults.headers.common['Authorization'];
  }
  // Get current base URL
  static getBaseURL(): string {
    return API_BASE_URL;
  }
  // Update base URL (for environment switching)
  static setBaseURL(url: string): void {
    apiClient.defaults.baseURL = url;
  }
}
// Export the axios instance for direct use if needed
export { apiClient };
// Export default
export default ApiClient;
