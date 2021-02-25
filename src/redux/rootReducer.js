import { combineReducers } from 'redux';

import category from './categoriesSlice';

//api
import { productsReducer as products } from '../api/productsSaga';

//import here all the slice from the features/components
const rootReducer = combineReducers({
  category,
  products,
});

export default rootReducer;
