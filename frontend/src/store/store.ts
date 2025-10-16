import  { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import graphReducer from './slices/graphSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    graph: graphReducer,
    ui: uiReducer,
  },
});
