import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import bookReducer from './slices/bookSlice';
import issueReducer from './slices/issueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    book: bookReducer,
    issue: issueReducer
  },
});
