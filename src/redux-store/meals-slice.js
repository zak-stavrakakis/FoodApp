import { createSlice } from '@reduxjs/toolkit';

const mealsSlice = createSlice({
  name: 'meals',
  initialState: {
    items: [],
  },
  reducers: {
    setMeals(state, action) {
      state.items = action.payload;
    },
    updateMeal(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      existingItem.name = newItem.name;
      existingItem.price = newItem.price;
      existingItem.description = newItem.description;
    },
  },
});

export const mealsActions = mealsSlice.actions;

export default mealsSlice;
