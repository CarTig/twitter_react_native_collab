import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import messagesReducer from './messagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
  },
});