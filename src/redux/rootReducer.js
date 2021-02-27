import { combineReducers } from 'redux';
import category from './categoriesSlice';

//api
import { productsReducer as products } from '../api/productsSaga';
import { availabilityReducer as availability } from '../api/availabilitySaga';

//combine here all the slice from the features/components
const rootReducer = combineReducers({
  category,
  products,
  availability,
});

export default rootReducer;
