import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import reducers
import authReducer from './slices/authSlice';
import conversationsReducer from './slices/conversationsSlice';
import crisisReducer from './slices/crisisSlice';
import progressReducer from './slices/progressSlice';
import journalReducer from './slices/journalSlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  conversations: conversationsReducer,
  crisis: crisisReducer,
  progress: progressReducer,
  journal: journalReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'progress'], // Only persist auth and progress data
  blacklist: ['conversations', 'crisis', 'journal'], // Don't persist sensitive data
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
export default { store, persistor };
