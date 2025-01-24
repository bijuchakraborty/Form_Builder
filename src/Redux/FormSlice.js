import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    username: '',
    isLoggedIn: false,
  },
  reducers: {
    setLoginData(state, action) {
      state.username = action.payload.username;
      state.isLoggedIn = true;
    },
    clearLoginData(state) {
      state.username = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setLoginData, clearLoginData } = formSlice.actions;

export default formSlice.reducer;