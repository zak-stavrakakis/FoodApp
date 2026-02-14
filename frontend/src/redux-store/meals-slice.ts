import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MealsState, Meal } from '../types';

const initialState: MealsState = {
  items: [],
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setMeals(state, action: PayloadAction<Meal[]>) {
      state.items = action.payload;
    },
    updateMeal(state, action: PayloadAction<Partial<Meal> & { id: string }>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        if (newItem.name !== undefined) existingItem.name = newItem.name;
        if (newItem.price !== undefined) existingItem.price = newItem.price;
        if (newItem.description !== undefined)
          existingItem.description = newItem.description;
      }
    },
  },
});

export const mealsActions = mealsSlice.actions;

export default mealsSlice;
