import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState, User } from '../types';

const initialState: UserState = {
  user: {},
  token: localStorage.getItem('token'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<User>>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (!action.payload) {
        localStorage.removeItem('token');
        return;
      }
      localStorage.setItem('token', action.payload);
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
