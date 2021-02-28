import { takeEvery, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import { availableCategories } from '../redux/categoriesSlice';

// action types
const PRODUCTS_REQ = 'PRODUCTS_REQ';
const PRODUCTS_OK = 'PRODUCTS_OK';
const PRODUCTS_ERROR = 'PRODUCTS_ERROR';

const RETRIES = 2;

//here I reduce the list of categories of interest [gloves, facemasks, beanies]
//to create the initial state wit a key for each product category
let initialState = availableCategories.reduce(
  (acc, curr) => (
    (acc[curr] = {
      ready: false,
    }),
    acc
  ),
  {},
);

//this must be imported in rootReducer
export function productsReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case PRODUCTS_REQ:
      return {
        ...state,
        [payload.category]: {
          ...state[payload.category],
          fetching: true,
        },
      };
    case PRODUCTS_OK:
      return {
        ...state,
        [payload.category]: {
          ready: true,
          fetching: false,
          error: null,
          data: payload.data,
        },
      };

    case PRODUCTS_ERROR:
      return {
        ...state,
        [payload.category]: {
          fetching: false,
          error: payload.error,
        },
      };

    default:
      return state;
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherProductsSaga() {
  yield takeEvery('PRODUCTS_REQ', workerProductsSaga);
}

// this is responsible of calling API
function fetchProducts(category) {
  let config = {
    method: 'get',
    url: '/v2/' + 'products/' + category,
    headers: {
      accept: 'Accept: application/json',
      'Access-Control-Allow-Origin': '*',
    },
    crossDomain: true,
  };
  return axios(config);
}

// worker saga: makes the api call when watcher saga sees the action
// the action is automatically passed by TakeLatest
export function* workerProductsSaga(action) {
  const { payload } = action;
  try {
    const apiData = yield call(_retryApi, payload);

    yield put({
      type: 'PRODUCTS_OK',
      payload: { category: payload.category, data: apiData },
    });
  } catch (error) {
    //console.log(error);
    yield put({
      type: 'PRODUCTS_ERROR',
      payload: { category: payload.category, error: error },
    });
  }
}

function* _retryApi(payload) {
  for (let i = 0; i < RETRIES; i++) {
    try {
      //in call you have (fn, ...args)
      const response = yield call(fetchProducts, payload.category);
      if (response) {
        if (response.status === 200) {
          return response.data;
        } else throw new Error('API response is bad'); //those are catched locally  to trigger delay
      } else throw new Error('API response was null');
    } catch (err) {
      // no need to add delay on last Retry
      if (i < RETRIES - 1) {
        yield delay(5000);
      }
    }
  } //end for
  throw new Error('API request failed after ' + RETRIES);
}
