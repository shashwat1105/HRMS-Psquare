import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidateReducer from './slices/candidateSlice';
import employeeReducer from './slices/employeeSlice';
import attendanceReducer from './slices/attendanceSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});