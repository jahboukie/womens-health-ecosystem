import { ApiClient } from './apiClient';
import { JournalEntry, ApiResponse } from '../types';

export class JournalService {
  // Get journal entries
  static async getJournalEntries(params: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<ApiResponse<JournalEntry[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
    if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());

    const response = await ApiClient.get<JournalEntry[]>(
      `/journal/entries?${queryParams.toString()}`
    );
    return response;
  }

  // Create journal entry
  static async createJournalEntry(data: {
    content: string;
    moodRating?: number;
    triggerTags?: string[];
    copingStrategiesUsed?: string[];
  }): Promise<ApiResponse<{ entry: JournalEntry; message: string }>> {
    const response = await ApiClient.post<{ entry: JournalEntry; message: string }>(
      '/journal/entries',
      data
    );
    return response;
  }

  // Update journal entry
  static async updateJournalEntry(data: {
    entryId: string;
    content?: string;
    moodRating?: number;
    triggerTags?: string[];
    copingStrategiesUsed?: string[];
  }): Promise<ApiResponse<{ entry: JournalEntry; message: string }>> {
    const { entryId, ...updateData } = data;
    const response = await ApiClient.patch<{ entry: JournalEntry; message: string }>(
      `/journal/entries/${entryId}`,
      updateData
    );
    return response;
  }

  // Delete journal entry
  static async deleteJournalEntry(entryId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await ApiClient.delete<{ message: string }>(
      `/journal/entries/${entryId}`
    );
    return response;
  }

  // Get single journal entry
  static async getJournalEntry(entryId: string): Promise<ApiResponse<JournalEntry>> {
    const response = await ApiClient.get<JournalEntry>(`/journal/entries/${entryId}`);
    return response;
  }

  // Analyze journal entry with AI
  static async analyzeJournalEntry(entryId: string): Promise<ApiResponse<{
    analysis: {
      sentiment: number;
      themes: string[];
      concerns: string[];
      positiveIndicators: string[];
      recommendedActions: string[];
      crisisRisk: number;
    };
  }>> {
    const response = await ApiClient.post<{
      analysis: {
        sentiment: number;
        themes: string[];
        concerns: string[];
        positiveIndicators: string[];
        recommendedActions: string[];
        crisisRisk: number;
      };
    }>(`/journal/entries/${entryId}/analyze`);
    return response;
  }

  // Search journal entries
  static async searchJournalEntries(params: {
    query: string;
    tags?: string[];
    moodRange?: [number, number];
    dateRange?: [Date, Date];
  }): Promise<ApiResponse<JournalEntry[]>> {
    const response = await ApiClient.post<JournalEntry[]>('/journal/search', params);
    return response;
  }

  // Get journal statistics
  static async getJournalStats(): Promise<{
    totalEntries: number;
    averageMood: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
    longestStreak: number;
    currentStreak: number;
    entriesThisMonth: number;
    moodTrend: 'improving' | 'stable' | 'declining';
  }> {
    const response = await ApiClient.get<{
      totalEntries: number;
      averageMood: number;
      mostCommonTags: Array<{ tag: string; count: number }>;
      longestStreak: number;
      currentStreak: number;
      entriesThisMonth: number;
      moodTrend: 'improving' | 'stable' | 'declining';
    }>('/journal/stats');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get journal statistics');
  }

  // Get journal prompts
  static async getJournalPrompts(context?: {
    mood?: number;
    recentTriggers?: string[];
    timeOfDay?: string;
  }): Promise<{
    prompts: Array<{
      id: string;
      text: string;
      category: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
  }> {
    const response = await ApiClient.post<{
      prompts: Array<{
        id: string;
        text: string;
        category: string;
        difficulty: 'easy' | 'medium' | 'hard';
      }>;
    }>('/journal/prompts', { context });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get journal prompts');
  }

  // Get mood insights from journal entries
  static async getMoodInsights(params: {
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<{
    averageMood: number;
    moodTrend: Array<{ date: Date; mood: number }>;
    triggerAnalysis: Array<{ trigger: string; impact: number; frequency: number }>;
    copingEffectiveness: Array<{ strategy: string; effectiveness: number; usage: number }>;
    recommendations: string[];
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
    if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());

    const response = await ApiClient.get<{
      averageMood: number;
      moodTrend: Array<{ date: Date; mood: number }>;
      triggerAnalysis: Array<{ trigger: string; impact: number; frequency: number }>;
      copingEffectiveness: Array<{ strategy: string; effectiveness: number; usage: number }>;
      recommendations: string[];
    }>(`/journal/mood-insights?${queryParams.toString()}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get mood insights');
  }

  // Export journal entries
  static async exportJournalEntries(format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await ApiClient.get(`/journal/export?format=${format}`, {
      responseType: 'blob',
    });

    return response as any; // Type assertion for blob response
  }

  // Get journal entry templates
  static async getJournalTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    template: string;
    category: string;
    tags: string[];
  }>> {
    const response = await ApiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      template: string;
      category: string;
      tags: string[];
    }>>('/journal/templates');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get journal templates');
  }

  // Save journal entry as draft
  static async saveDraft(data: {
    content: string;
    moodRating?: number;
    triggerTags?: string[];
    copingStrategiesUsed?: string[];
  }): Promise<{ draftId: string; message: string }> {
    const response = await ApiClient.post<{ draftId: string; message: string }>(
      '/journal/drafts',
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to save draft');
  }

  // Get journal drafts
  static async getDrafts(): Promise<Array<{
    id: string;
    content: string;
    moodRating?: number;
    triggerTags?: string[];
    copingStrategiesUsed?: string[];
    createdAt: Date;
    updatedAt: Date;
  }>> {
    const response = await ApiClient.get<Array<{
      id: string;
      content: string;
      moodRating?: number;
      triggerTags?: string[];
      copingStrategiesUsed?: string[];
      createdAt: Date;
      updatedAt: Date;
    }>>('/journal/drafts');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get drafts');
  }

  // Delete draft
  static async deleteDraft(draftId: string): Promise<void> {
    const response = await ApiClient.delete(`/journal/drafts/${draftId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete draft');
    }
  }

  // Get journal reminders
  static async getJournalReminders(): Promise<Array<{
    id: string;
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    message: string;
    enabled: boolean;
  }>> {
    const response = await ApiClient.get<Array<{
      id: string;
      time: string;
      frequency: 'daily' | 'weekly' | 'custom';
      message: string;
      enabled: boolean;
    }>>('/journal/reminders');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get journal reminders');
  }

  // Set journal reminder
  static async setJournalReminder(data: {
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    message?: string;
    enabled: boolean;
  }): Promise<{ reminderId: string; message: string }> {
    const response = await ApiClient.post<{ reminderId: string; message: string }>(
      '/journal/reminders',
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to set journal reminder');
  }
}

export const journalService = JournalService;
