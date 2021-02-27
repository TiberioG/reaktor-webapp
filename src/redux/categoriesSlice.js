import { createSlice } from '@reduxjs/toolkit';

//this reducer is used to store the current category to display the right tab
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

// use this to extend the app to support more categories
export const availableCategories = ['gloves', 'facemasks', 'beanies'];
