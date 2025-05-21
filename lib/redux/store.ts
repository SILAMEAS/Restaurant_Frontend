// lib/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@/lib/redux/api';
import counterReducer from './counterSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authSlice } from './auth';

// Combine all reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
  counter: counterReducer,
});

// Persist only the counter slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, authSlice.middleware),
  devTools: typeof window !== 'undefined',
});

setupListeners(store.dispatch);

// Create the persistor
export const persistor = persistStore(store);

// Types
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
