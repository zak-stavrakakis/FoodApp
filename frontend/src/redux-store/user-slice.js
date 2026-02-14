import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: {}, token: localStorage.getItem('token') },
  reducers: {
    setUser(state, action) {
      state.user.id = action.payload.id;
      state.user.email = action.payload.email;
      state.user.role = action.payload.role;
    },
    setToken(state, action) {
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
