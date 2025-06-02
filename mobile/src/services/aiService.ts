import { ApiClient } from './apiClient';
import { AIResponse, Conversation, ConversationMessage, ApiResponse } from '../types';

export class AIService {
  // Start a new conversation
  static async startConversation(data: {
    conversationType: 'checkin' | 'crisis' | 'journal' | 'casual';
    initialMessage: string;
    context?: any;
  }): Promise<{
    conversationId: string;
    aiResponse: AIResponse;
    conversationType: string;
    initialMessage: string;
  }> {
    const response = await ApiClient.post<{
      conversationId: string;
      aiResponse: AIResponse;
    }>('/ai/conversation', data);

    if (response.success && response.data) {
      return {
        ...response.data,
        conversationType: data.conversationType,
        initialMessage: data.initialMessage,
      };
    }

    throw new Error(response.error || 'Failed to start conversation');
  }

  // Send a message in an existing conversation
  static async sendMessage(data: {
    conversationId: string;
    message: string;
    metadata?: any;
  }): Promise<AIResponse> {
    const response = await ApiClient.post<AIResponse>(
      `/ai/conversation/${data.conversationId}/message`,
      {
        message: data.message,
        metadata: data.metadata,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to send message');
  }

  // Get conversation history
  static async getConversations(params: {
    page?: number;
    limit?: number;
    type?: string;
  } = {}): Promise<Conversation[]> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.type) queryParams.append('type', params.type);

    const response = await ApiClient.get<Conversation[]>(
      `/ai/conversations?${queryParams.toString()}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to load conversations');
  }

  // Get detailed conversation with messages
  static async getConversationDetails(conversationId: string): Promise<Conversation> {
    const response = await ApiClient.get<Conversation>(
      `/ai/conversation/${conversationId}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to load conversation details');
  }

  // End a conversation
  static async endConversation(conversationId: string): Promise<void> {
    const response = await ApiClient.post(
      `/ai/conversation/${conversationId}/end`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to end conversation');
    }
  }

  // Get AI conversation suggestions
  static async getConversationSuggestions(context?: {
    mood?: number;
    recentTriggers?: string[];
    timeOfDay?: string;
  }): Promise<{
    suggestions: string[];
    conversationType: string;
  }> {
    const response = await ApiClient.post<{
      suggestions: string[];
      conversationType: string;
    }>('/ai/suggestions', { context });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get conversation suggestions');
  }

  // Get coping strategy recommendations
  static async getCopingStrategies(context: {
    currentMood?: number;
    triggers?: string[];
    previousStrategies?: string[];
  }): Promise<{
    strategies: Array<{
      name: string;
      type: string;
      description: string;
      instructions: string;
      effectiveness: number;
    }>;
  }> {
    const response = await ApiClient.post<{
      strategies: Array<{
        name: string;
        type: string;
        description: string;
        instructions: string;
        effectiveness: number;
      }>;
    }>('/ai/coping-strategies', { context });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get coping strategies');
  }

  // Analyze mood from text
  static async analyzeMood(text: string): Promise<{
    moodScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    triggers?: string[];
  }> {
    const response = await ApiClient.post<{
      moodScore: number;
      sentiment: 'positive' | 'negative' | 'neutral';
      confidence: number;
      triggers?: string[];
    }>('/ai/analyze-mood', { text });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to analyze mood');
  }

  // Get personalized check-in questions
  static async getCheckInQuestions(userContext?: {
    lastCheckIn?: Date;
    recentMood?: number;
    recentTriggers?: string[];
  }): Promise<{
    questions: string[];
    priority: 'low' | 'medium' | 'high';
  }> {
    const response = await ApiClient.post<{
      questions: string[];
      priority: 'low' | 'medium' | 'high';
    }>('/ai/checkin-questions', { userContext });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get check-in questions');
  }

  // Report conversation feedback
  static async reportFeedback(data: {
    conversationId: string;
    messageId: string;
    feedback: 'helpful' | 'not_helpful' | 'inappropriate';
    comment?: string;
  }): Promise<void> {
    const response = await ApiClient.post('/ai/feedback', data);

    if (!response.success) {
      throw new Error(response.error || 'Failed to submit feedback');
    }
  }

  // Get AI conversation statistics
  static async getConversationStats(): Promise<{
    totalConversations: number;
    averageLength: number;
    mostCommonType: string;
    crisisDetectionCount: number;
    helpfulnessRating: number;
  }> {
    const response = await ApiClient.get<{
      totalConversations: number;
      averageLength: number;
      mostCommonType: string;
      crisisDetectionCount: number;
      helpfulnessRating: number;
    }>('/ai/stats');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get conversation statistics');
  }

  // Search conversations
  static async searchConversations(query: {
    text?: string;
    type?: string;
    dateRange?: [Date, Date];
    crisisOnly?: boolean;
  }): Promise<Conversation[]> {
    const response = await ApiClient.post<Conversation[]>('/ai/search', query);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to search conversations');
  }

  // Export conversation data
  static async exportConversations(format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await ApiClient.get(`/ai/export?format=${format}`, {
      responseType: 'blob',
    });

    return response as any; // Type assertion for blob response
  }

  // Delete conversation
  static async deleteConversation(conversationId: string): Promise<void> {
    const response = await ApiClient.delete(`/ai/conversation/${conversationId}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete conversation');
    }
  }

  // Get AI model information
  static async getModelInfo(): Promise<{
    model: string;
    version: string;
    capabilities: string[];
    lastUpdated: Date;
  }> {
    const response = await ApiClient.get<{
      model: string;
      version: string;
      capabilities: string[];
      lastUpdated: Date;
    }>('/ai/model-info');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get model information');
  }
}

export const aiService = AIService;
