// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@/lib/redux/api';
import counterReducer from './counterSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Define the shape of the root state
interface RootState {
    [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
    counter: ReturnType<typeof counterReducer>;
}

// Persist config for the counter slice
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['counter'],
};

// Combine reducers and apply persistence with proper typing
const persistedReducer = persistReducer<RootState>(persistConfig, (state, action) => ({
    [apiSlice.reducerPath]: apiSlice.reducer(
        state ? state[apiSlice.reducerPath] : undefined,
        action
    ),
    counter: counterReducer(state ? state.counter : undefined, action),
}));

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

// Create the persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types after store creation
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;