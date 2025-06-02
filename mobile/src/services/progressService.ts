import { ApiClient } from './apiClient';
import { ProgressMetrics, Milestone, CopingStrategy, ApiResponse } from '../types';

export class ProgressService {
  // Get progress dashboard data
  static async getProgressDashboard(): Promise<ApiResponse<ProgressMetrics>> {
    const response = await ApiClient.get<ProgressMetrics>('/progress/dashboard');
    return response;
  }

  // Add milestone
  static async addMilestone(data: {
    milestoneType: 'days_sober' | 'weeks_clean' | 'months_milestone' | 'custom';
    milestoneValue: number;
    celebrationPlan?: string;
    sharedWithSupport?: boolean;
  }): Promise<ApiResponse<{ milestone: Milestone; message: string }>> {
    const response = await ApiClient.post<{ milestone: Milestone; message: string }>(
      '/progress/milestone',
      data
    );
    return response;
  }

  // Add or update coping strategy
  static async addCopingStrategy(data: {
    strategyName: string;
    strategyType: 'mindfulness' | 'physical' | 'social' | 'cognitive' | 'creative' | 'spiritual';
    effectivenessRating?: number;
    customInstructions?: string;
  }): Promise<ApiResponse<{ strategy: CopingStrategy; message: string }>> {
    const response = await ApiClient.post<{ strategy: CopingStrategy; message: string }>(
      '/progress/coping-strategy',
      data
    );
    return response;
  }

  // Get all coping strategies
  static async getCopingStrategies(): Promise<ApiResponse<CopingStrategy[]>> {
    const response = await ApiClient.get<CopingStrategy[]>('/progress/coping-strategies');
    return response;
  }

  // Update coping strategy
  static async updateCopingStrategy(data: {
    strategyId: string;
    effectivenessRating?: number;
    customInstructions?: string;
  }): Promise<ApiResponse<{ strategy: CopingStrategy; message: string }>> {
    const response = await ApiClient.patch<{ strategy: CopingStrategy; message: string }>(
      `/progress/coping-strategy/${data.strategyId}`,
      {
        effectivenessRating: data.effectivenessRating,
        customInstructions: data.customInstructions,
      }
    );
    return response;
  }

  // Delete milestone
  static async deleteMilestone(milestoneId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await ApiClient.delete<{ message: string }>(
      `/progress/milestone/${milestoneId}`
    );
    return response;
  }

  // Get progress statistics
  static async getProgressStats(): Promise<ApiResponse<{
    totalMilestones: number;
    totalStrategies: number;
    averageMoodLast30Days: number;
    mostUsedStrategy: {
      name: string;
      type: string;
      usageCount: number;
      effectiveness: number;
    } | null;
  }>> {
    const response = await ApiClient.get<{
      totalMilestones: number;
      totalStrategies: number;
      averageMoodLast30Days: number;
      mostUsedStrategy: {
        name: string;
        type: string;
        usageCount: number;
        effectiveness: number;
      } | null;
    }>('/progress/stats');
    return response;
  }

  // Log mood entry
  static async logMoodEntry(data: {
    rating: number;
    notes?: string;
    triggers?: string[];
    copingStrategiesUsed?: string[];
  }): Promise<{ entryId: string; message: string }> {
    const response = await ApiClient.post<{ entryId: string; message: string }>(
      '/progress/mood',
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to log mood entry');
  }

  // Get mood history
  static async getMoodHistory(params: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): Promise<Array<{
    date: Date;
    rating: number;
    notes?: string;
    triggers?: string[];
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
    if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await ApiClient.get<Array<{
      date: Date;
      rating: number;
      notes?: string;
      triggers?: string[];
    }>>(`/progress/mood-history?${queryParams.toString()}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get mood history');
  }

  // Get milestone suggestions
  static async getMilestoneSuggestions(): Promise<Array<{
    type: string;
    value: number;
    description: string;
    achievable: boolean;
    daysUntil?: number;
  }>> {
    const response = await ApiClient.get<Array<{
      type: string;
      value: number;
      description: string;
      achievable: boolean;
      daysUntil?: number;
    }>>('/progress/milestone-suggestions');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get milestone suggestions');
  }

  // Get coping strategy recommendations
  static async getStrategyRecommendations(context: {
    currentMood?: number;
    recentTriggers?: string[];
    timeOfDay?: string;
    location?: string;
  }): Promise<Array<{
    name: string;
    type: string;
    description: string;
    instructions: string;
    estimatedEffectiveness: number;
    timeRequired: string;
  }>> {
    const response = await ApiClient.post<Array<{
      name: string;
      type: string;
      description: string;
      instructions: string;
      estimatedEffectiveness: number;
      timeRequired: string;
    }>>('/progress/strategy-recommendations', { context });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get strategy recommendations');
  }

  // Track strategy usage
  static async trackStrategyUsage(data: {
    strategyId: string;
    effectivenessRating?: number;
    duration?: number;
    notes?: string;
  }): Promise<{ message: string }> {
    const response = await ApiClient.post<{ message: string }>(
      '/progress/track-strategy-usage',
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to track strategy usage');
  }

  // Get progress insights
  static async getProgressInsights(): Promise<{
    trends: {
      moodTrend: 'improving' | 'stable' | 'declining';
      streakTrend: 'growing' | 'stable' | 'broken';
      engagementTrend: 'increasing' | 'stable' | 'decreasing';
    };
    achievements: Array<{
      type: string;
      description: string;
      achievedAt: Date;
    }>;
    recommendations: Array<{
      type: string;
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  }> {
    const response = await ApiClient.get<{
      trends: {
        moodTrend: 'improving' | 'stable' | 'declining';
        streakTrend: 'growing' | 'stable' | 'broken';
        engagementTrend: 'increasing' | 'stable' | 'decreasing';
      };
      achievements: Array<{
        type: string;
        description: string;
        achievedAt: Date;
      }>;
      recommendations: Array<{
        type: string;
        title: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
      }>;
    }>('/progress/insights');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get progress insights');
  }

  // Export progress data
  static async exportProgressData(format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await ApiClient.get(`/progress/export?format=${format}`, {
      responseType: 'blob',
    });

    return response as any; // Type assertion for blob response
  }

  // Set progress goals
  static async setProgressGoals(goals: {
    sobrietyGoal?: number; // days
    moodGoal?: number; // average rating
    strategyUsageGoal?: number; // times per week
    journalGoal?: number; // entries per week
  }): Promise<{ message: string }> {
    const response = await ApiClient.post<{ message: string }>(
      '/progress/goals',
      goals
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to set progress goals');
  }

  // Get progress goals
  static async getProgressGoals(): Promise<{
    sobrietyGoal?: number;
    moodGoal?: number;
    strategyUsageGoal?: number;
    journalGoal?: number;
    progress: {
      sobrietyProgress?: number;
      moodProgress?: number;
      strategyUsageProgress?: number;
      journalProgress?: number;
    };
  }> {
    const response = await ApiClient.get<{
      sobrietyGoal?: number;
      moodGoal?: number;
      strategyUsageGoal?: number;
      journalGoal?: number;
      progress: {
        sobrietyProgress?: number;
        moodProgress?: number;
        strategyUsageProgress?: number;
        journalProgress?: number;
      };
    }>('/progress/goals');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get progress goals');
  }
}

export const progressService = ProgressService;
