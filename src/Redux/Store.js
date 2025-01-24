import { configureStore } from '@reduxjs/toolkit';
import formReducer from './FormSlice';
import { apiSlice } from './ApiSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;