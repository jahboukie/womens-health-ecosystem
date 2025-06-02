import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ConversationState, Conversation, ConversationMessage, AIResponse } from '../../types';
import { aiService } from '../../services/aiService';

// Initial state
const initialState: ConversationState = {
  conversations: [],
  currentConversation: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const startConversation = createAsyncThunk(
  'conversations/start',
  async (
    data: {
      conversationType: 'checkin' | 'crisis' | 'journal' | 'casual';
      initialMessage: string;
      context?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await aiService.startConversation(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async (
    data: {
      conversationId: string;
      message: string;
      metadata?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await aiService.sendMessage(data);
      return {
        conversationId: data.conversationId,
        userMessage: data.message,
        aiResponse: response,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const loadConversations = createAsyncThunk(
  'conversations/load',
  async (
    params: {
      page?: number;
      limit?: number;
      type?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await aiService.getConversations(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load conversations');
    }
  }
);

export const loadConversationDetails = createAsyncThunk(
  'conversations/loadDetails',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await aiService.getConversationDetails(conversationId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load conversation details');
    }
  }
);

export const endConversation = createAsyncThunk(
  'conversations/end',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await aiService.endConversation(conversationId);
      return conversationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to end conversation');
    }
  }
);

// Conversations slice
const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessageToCurrentConversation: (state, action: PayloadAction<ConversationMessage>) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
      }
    },
    updateConversationInList: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    clearConversations: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      state.error = null;
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(conv => conv.id === action.payload);
      if (conversation) {
        // Mark as read logic here
      }
    },
  },
  extraReducers: (builder) => {
    // Start conversation
    builder
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const newConversation: Conversation = {
          id: action.payload.conversationId,
          conversationType: (action.payload.conversationType as 'checkin' | 'crisis' | 'journal' | 'casual') || 'casual',
          messages: [
            {
              id: Date.now().toString(),
              role: 'user',
              content: action.payload.initialMessage || '',
              timestamp: new Date().toISOString(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: action.payload.aiResponse?.message || '',
              timestamp: new Date().toISOString(),
              metadata: {
                crisisFlags: action.payload.aiResponse?.crisisDetected ? ['crisis'] : [],
                urgencyLevel: (action.payload.aiResponse?.severityLevel || 0) > 3 ? 'high' : 'low',
              },
            },
          ],
          createdAt: new Date().toISOString(),
          crisisDetected: action.payload.aiResponse?.crisisDetected || false,
        };

        state.conversations.unshift(newConversation);
        state.currentConversation = newConversation;
        state.error = null;
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;

        const userMessage: ConversationMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: action.payload.userMessage,
          timestamp: new Date().toISOString(),
        };

        const aiMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: action.payload.aiResponse?.message || '',
          timestamp: new Date().toISOString(),
          metadata: {
            crisisFlags: action.payload.aiResponse?.crisisDetected ? ['crisis'] : [],
            urgencyLevel: (action.payload.aiResponse?.severityLevel || 0) > 3 ? 'high' : 'low',
          },
        };

        // Add messages to current conversation
        if (state.currentConversation && state.currentConversation.id === action.payload.conversationId) {
          state.currentConversation.messages.push(userMessage, aiMessage);

          // Update crisis detection status
          if (action.payload.aiResponse?.crisisDetected) {
            state.currentConversation.crisisDetected = true;
          }
        }

        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload.conversationId
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].messages.push(userMessage, aiMessage);
          if (action.payload.aiResponse?.crisisDetected) {
            state.conversations[conversationIndex].crisisDetected = true;
          }
        }

        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load conversations
    builder
      .addCase(loadConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = (action.payload as any)?.data || action.payload || [];
        state.error = null;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load conversation details
    builder
      .addCase(loadConversationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadConversationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.error = null;
      })
      .addCase(loadConversationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // End conversation
    builder
      .addCase(endConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endConversation.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === action.payload
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].endedAt = new Date().toISOString();
        }

        // Clear current conversation if it's the one being ended
        if (state.currentConversation && state.currentConversation.id === action.payload) {
          state.currentConversation.endedAt = new Date().toISOString();
        }

        state.error = null;
      })
      .addCase(endConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentConversation,
  addMessageToCurrentConversation,
  updateConversationInList,
  clearConversations,
  markConversationAsRead,
} = conversationsSlice.actions;

// Export reducer
export default conversationsSlice.reducer;
