import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: {} },
  reducers: {
    setUser(state, action) {
      state.user.id = action.payload.id;
      state.user.email = action.payload.email;
      state.user.role = action.payload.role;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
