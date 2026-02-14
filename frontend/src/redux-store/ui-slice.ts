import { createSlice } from '@reduxjs/toolkit';
import type { UiState } from '../types';

const initialState: UiState = { cartIsVisible: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
