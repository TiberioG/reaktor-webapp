import { createSlice } from '@reduxjs/toolkit';

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: 'gloves',
  reducers: {
    setCategory(state, action) {
      return action.payload;
    },
  },
});

export const { setCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

export const availableCategories = ['gloves', 'facemasks', 'beanies'];
