import { configureStore } from '@reduxjs/toolkit';
import authSlice from "./authentication/authSlice"
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userReducer,
  },
})