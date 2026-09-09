import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer.js';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});
