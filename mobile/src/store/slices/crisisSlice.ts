import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CrisisState, CrisisEvent, CrisisResource } from '../../types';
import { crisisService } from '../../services/crisisService';

// Initial state
const initialState: CrisisState = {
  events: [],
  resources: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const loadCrisisResources = createAsyncThunk(
  'crisis/loadResources',
  async (
    params: {
      location?: string;
      type?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await crisisService.getCrisisResources(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load crisis resources');
    }
  }
);

export const loadCrisisEvents = createAsyncThunk(
  'crisis/loadEvents',
  async (
    params: {
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await crisisService.getCrisisEvents(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load crisis events');
    }
  }
);

export const submitCrisisFollowUp = createAsyncThunk(
  'crisis/submitFollowUp',
  async (
    data: {
      eventId: string;
      userSafe: boolean;
      professionalContacted?: boolean;
      nextCheckin?: Date;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await crisisService.submitFollowUp(data);
      return {
        eventId: data.eventId,
        followUpData: data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit follow-up');
    }
  }
);

export const notifyEmergencyContacts = createAsyncThunk(
  'crisis/notifyEmergencyContacts',
  async (
    data: {
      eventId: string;
      contactIds?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await crisisService.notifyEmergencyContacts(data);
      return {
        eventId: data.eventId,
        contactsNotified: response.data?.contactsNotified || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to notify emergency contacts');
    }
  }
);

export const getCrisisStats = createAsyncThunk(
  'crisis/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crisisService.getCrisisStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load crisis statistics');
    }
  }
);

// Crisis slice
const crisisSlice = createSlice({
  name: 'crisis',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addCrisisEvent: (state, action: PayloadAction<CrisisEvent>) => {
      state.events.unshift(action.payload);
    },
    updateCrisisEvent: (state, action: PayloadAction<CrisisEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    markEventAsResolved: (state, action: PayloadAction<string>) => {
      const event = state.events.find(event => event.id === action.payload);
      if (event) {
        event.status = 'resolved';
        event.resolvedAt = new Date();
      }
    },
    clearCrisisData: (state) => {
      state.events = [];
      state.resources = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load crisis resources
    builder
      .addCase(loadCrisisResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCrisisResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload || [];
        state.error = null;
      })
      .addCase(loadCrisisResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load crisis events
    builder
      .addCase(loadCrisisEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCrisisEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload || [];
        state.error = null;
      })
      .addCase(loadCrisisEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit crisis follow-up
    builder
      .addCase(submitCrisisFollowUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitCrisisFollowUp.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update the event in the list
        const eventIndex = state.events.findIndex(
          event => event.id === action.payload.eventId
        );
        if (eventIndex !== -1) {
          const event = state.events[eventIndex];
          if (action.payload.followUpData.userSafe) {
            event.status = 'resolved';
            event.resolvedAt = new Date();
            event.userSafeConfirmation = new Date();
          }
          if (action.payload.followUpData.professionalContacted !== undefined) {
            event.professionalContacted = action.payload.followUpData.professionalContacted;
          }
          if (action.payload.followUpData.nextCheckin) {
            event.followUpScheduled = action.payload.followUpData.nextCheckin;
          }
        }

        state.error = null;
      })
      .addCase(submitCrisisFollowUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Notify emergency contacts
    builder
      .addCase(notifyEmergencyContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(notifyEmergencyContacts.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update the event to reflect that contacts were notified
        const eventIndex = state.events.findIndex(
          event => event.id === action.payload.eventId
        );
        if (eventIndex !== -1) {
          // Add notification metadata to the event
          // This would be expanded based on the actual event structure
        }

        state.error = null;
      })
      .addCase(notifyEmergencyContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get crisis stats
    builder
      .addCase(getCrisisStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCrisisStats.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store stats in state if needed
        state.error = null;
      })
      .addCase(getCrisisStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  addCrisisEvent,
  updateCrisisEvent,
  markEventAsResolved,
  clearCrisisData,
} = crisisSlice.actions;

// Export reducer
export default crisisSlice.reducer;
