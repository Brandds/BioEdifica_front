import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carrinhoReducer from './slices/carrinhoSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    carrinho: carrinhoReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;