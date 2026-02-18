import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MealsState, MealCount, Meal } from '../types';

const initialState: MealsState = {
  items: [],
  count: 0
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setMeals(state, action: PayloadAction<MealCount>) {
      state.items = action.payload.meals;
      state.count = action.payload.count
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
