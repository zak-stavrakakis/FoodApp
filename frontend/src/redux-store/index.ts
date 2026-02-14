import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import cartSlice from './cart-slice';
import userSlice from './user-slice';
import mealsSlice from './meals-slice';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    cart: cartSlice.reducer,
    user: userSlice.reducer,
    meals: mealsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
