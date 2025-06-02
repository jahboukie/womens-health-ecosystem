import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProgressState, ProgressMetrics, Milestone, CopingStrategy } from '../../types';
import { progressService } from '../../services/progressService';

// Initial state
const initialState: ProgressState = {
  metrics: null,
  milestones: [],
  copingStrategies: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const loadProgressDashboard = createAsyncThunk(
  'progress/loadDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getProgressDashboard();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load progress dashboard');
    }
  }
);

export const addMilestone = createAsyncThunk(
  'progress/addMilestone',
  async (
    data: {
      milestoneType: 'days_sober' | 'weeks_clean' | 'months_milestone' | 'custom';
      milestoneValue: number;
      celebrationPlan?: string;
      sharedWithSupport?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await progressService.addMilestone(data);
      return response.data?.milestone;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add milestone');
    }
  }
);

export const addCopingStrategy = createAsyncThunk(
  'progress/addCopingStrategy',
  async (
    data: {
      strategyName: string;
      strategyType: 'mindfulness' | 'physical' | 'social' | 'cognitive' | 'creative' | 'spiritual';
      effectivenessRating?: number;
      customInstructions?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await progressService.addCopingStrategy(data);
      return response.data?.strategy;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add coping strategy');
    }
  }
);

export const loadCopingStrategies = createAsyncThunk(
  'progress/loadCopingStrategies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getCopingStrategies();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load coping strategies');
    }
  }
);

export const updateCopingStrategy = createAsyncThunk(
  'progress/updateCopingStrategy',
  async (
    data: {
      strategyId: string;
      effectivenessRating?: number;
      customInstructions?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await progressService.updateCopingStrategy(data);
      return response.data?.strategy;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update coping strategy');
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  'progress/deleteMilestone',
  async (milestoneId: string, { rejectWithValue }) => {
    try {
      await progressService.deleteMilestone(milestoneId);
      return milestoneId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete milestone');
    }
  }
);

export const getProgressStats = createAsyncThunk(
  'progress/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getProgressStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load progress statistics');
    }
  }
);

// Progress slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateMilestone: (state, action: PayloadAction<Milestone>) => {
      const index = state.milestones.findIndex(milestone => milestone.id === action.payload.id);
      if (index !== -1) {
        state.milestones[index] = action.payload;
      }
    },
    updateCopingStrategyLocal: (state, action: PayloadAction<CopingStrategy>) => {
      const index = state.copingStrategies.findIndex(strategy => strategy.id === action.payload.id);
      if (index !== -1) {
        state.copingStrategies[index] = action.payload;
      }
    },
    incrementStrategyUsage: (state, action: PayloadAction<string>) => {
      const strategy = state.copingStrategies.find(s => s.id === action.payload);
      if (strategy) {
        strategy.usageFrequency += 1;
        strategy.lastUsed = new Date();
      }
    },
    clearProgressData: (state) => {
      state.metrics = null;
      state.milestones = [];
      state.copingStrategies = [];
      state.error = null;
    },
    updateCurrentStreak: (state, action: PayloadAction<number>) => {
      if (state.metrics) {
        state.metrics.currentStreak = action.payload;
        if (action.payload > state.metrics.longestStreak) {
          state.metrics.longestStreak = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Load progress dashboard
    builder
      .addCase(loadProgressDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadProgressDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload || null;
        if (action.payload?.recentAchievements) {
          state.milestones = action.payload.recentAchievements;
        }
        if (action.payload?.copingStrategyEffectiveness) {
          state.copingStrategies = action.payload.copingStrategyEffectiveness;
        }
        state.error = null;
      })
      .addCase(loadProgressDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add milestone
    builder
      .addCase(addMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.milestones.unshift(action.payload);
        }
        state.error = null;
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add coping strategy
    builder
      .addCase(addCopingStrategy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCopingStrategy.fulfilled, (state, action) => {
        state.isLoading = false;

        // Check if strategy already exists (update) or is new (add)
        if (action.payload) {
          const existingIndex = state.copingStrategies.findIndex(
            s => s.strategyName.toLowerCase() === action.payload!.strategyName.toLowerCase()
          );

          if (existingIndex !== -1) {
            state.copingStrategies[existingIndex] = action.payload;
          } else {
            state.copingStrategies.push(action.payload);
          }
        }

        state.error = null;
      })
      .addCase(addCopingStrategy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load coping strategies
    builder
      .addCase(loadCopingStrategies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCopingStrategies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.copingStrategies = action.payload || [];
        state.error = null;
      })
      .addCase(loadCopingStrategies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update coping strategy
    builder
      .addCase(updateCopingStrategy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCopingStrategy.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload) {
          const index = state.copingStrategies.findIndex(
            strategy => strategy.id === action.payload!.id
          );
          if (index !== -1) {
            state.copingStrategies[index] = action.payload;
          }
        }

        state.error = null;
      })
      .addCase(updateCopingStrategy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete milestone
    builder
      .addCase(deleteMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = state.milestones.filter(
          milestone => milestone.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get progress stats
    builder
      .addCase(getProgressStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProgressStats.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store stats if needed
        state.error = null;
      })
      .addCase(getProgressStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  updateMilestone,
  updateCopingStrategyLocal,
  incrementStrategyUsage,
  clearProgressData,
  updateCurrentStreak,
} = progressSlice.actions;

// Export reducer
export default progressSlice.reducer;
