import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JournalState, JournalEntry } from '../../types';
import { journalService } from '../../services/journalService';

// Initial state
const initialState: JournalState = {
  entries: [],
  currentEntry: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const loadJournalEntries = createAsyncThunk(
  'journal/loadEntries',
  async (
    params: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await journalService.getJournalEntries(params);
      return response.data || [];
    } catch (error: any) {
      // For now, return empty array if API fails (backend not running)
      console.warn('Journal API not available, returning empty entries:', error.message);
      return [];
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (
    data: {
      content: string;
      moodRating?: number;
      triggerTags?: string[];
      copingStrategiesUsed?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await journalService.createJournalEntry(data);
      return response.data?.entry;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create journal entry');
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async (
    data: {
      entryId: string;
      content?: string;
      moodRating?: number;
      triggerTags?: string[];
      copingStrategiesUsed?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await journalService.updateJournalEntry(data);
      return response.data?.entry;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update journal entry');
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      await journalService.deleteJournalEntry(entryId);
      return entryId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete journal entry');
    }
  }
);

export const getJournalEntry = createAsyncThunk(
  'journal/getEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await journalService.getJournalEntry(entryId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load journal entry');
    }
  }
);

export const analyzeJournalEntry = createAsyncThunk(
  'journal/analyzeEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await journalService.analyzeJournalEntry(entryId);
      return {
        entryId,
        analysis: response.data?.analysis,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to analyze journal entry');
    }
  }
);

export const searchJournalEntries = createAsyncThunk(
  'journal/searchEntries',
  async (
    params: {
      query: string;
      tags?: string[];
      moodRange?: [number, number];
      dateRange?: [Date, Date];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await journalService.searchJournalEntries(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search journal entries');
    }
  }
);

// Journal slice
const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action: PayloadAction<JournalEntry | null>) => {
      state.currentEntry = action.payload;
    },
    updateCurrentEntry: (state, action: PayloadAction<Partial<JournalEntry>>) => {
      if (state.currentEntry) {
        state.currentEntry = { ...state.currentEntry, ...action.payload };
      }
    },
    addEntryToList: (state, action: PayloadAction<JournalEntry>) => {
      state.entries.unshift(action.payload);
    },
    updateEntryInList: (state, action: PayloadAction<JournalEntry>) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    removeEntryFromList: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
    clearJournalData: (state) => {
      state.entries = [];
      state.currentEntry = null;
      state.error = null;
    },
    sortEntriesByDate: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.entries.sort((a, b) => {
        const dateA = new Date(a.entryDate).getTime();
        const dateB = new Date(b.entryDate).getTime();
        return action.payload === 'asc' ? dateA - dateB : dateB - dateA;
      });
    },
    filterEntriesByMood: (state, action: PayloadAction<[number, number] | null>) => {
      if (action.payload) {
        const [min, max] = action.payload;
        state.entries = state.entries.filter(entry =>
          entry.moodRating !== undefined &&
          entry.moodRating >= min &&
          entry.moodRating <= max
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Load journal entries
    builder
      .addCase(loadJournalEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadJournalEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload || [];
        state.error = null;
      })
      .addCase(loadJournalEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create journal entry
    builder
      .addCase(createJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.entries.unshift(action.payload);
          state.currentEntry = action.payload;
        }
        state.error = null;
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update journal entry
    builder
      .addCase(updateJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update entry in list
        if (action.payload) {
          const index = state.entries.findIndex(entry => entry.id === action.payload!.id);
          if (index !== -1) {
            state.entries[index] = action.payload;
          }

          // Update current entry if it's the same
          if (state.currentEntry && state.currentEntry.id === action.payload.id) {
            state.currentEntry = action.payload;
          }
        }

        state.error = null;
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete journal entry
    builder
      .addCase(deleteJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;

        // Remove entry from list
        state.entries = state.entries.filter(entry => entry.id !== action.payload);

        // Clear current entry if it's the deleted one
        if (state.currentEntry && state.currentEntry.id === action.payload) {
          state.currentEntry = null;
        }

        state.error = null;
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get journal entry
    builder
      .addCase(getJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEntry = action.payload || null;
        state.error = null;
      })
      .addCase(getJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Analyze journal entry
    builder
      .addCase(analyzeJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;

        // Update entry with analysis
        const index = state.entries.findIndex(entry => entry.id === action.payload.entryId);
        if (index !== -1) {
          state.entries[index].aiAnalysis = action.payload.analysis;
        }

        // Update current entry if it's the same
        if (state.currentEntry && state.currentEntry.id === action.payload.entryId) {
          state.currentEntry.aiAnalysis = action.payload.analysis;
        }

        state.error = null;
      })
      .addCase(analyzeJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search journal entries
    builder
      .addCase(searchJournalEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchJournalEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        // Replace entries with search results
        state.entries = action.payload || [];
        state.error = null;
      })
      .addCase(searchJournalEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentEntry,
  updateCurrentEntry,
  addEntryToList,
  updateEntryInList,
  removeEntryFromList,
  clearJournalData,
  sortEntriesByDate,
  filterEntriesByMood,
} = journalSlice.actions;

// Export reducer
export default journalSlice.reducer;
