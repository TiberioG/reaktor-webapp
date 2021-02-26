import { takeEvery, call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import API_CONFIG from './API-config.json';
import { availableCategories } from '../redux/categoriesSlice';

// action types
const PRODUCTS_REQ = 'PRODUCTS_REQ';
const PRODUCTS_OK = 'PRODUCTS_OK';
const PRODUCTS_KO = 'PRODUCTS_KO'; // this if axios fetch was ok but server returns error
const PRODUCTS_FETCH_ERR = 'PRODUCTS_FETCH_ERR'; // this if we catch an error from axios fetch

const isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

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

    case PRODUCTS_KO:
      return {
        ...state,
        fetching: false,
        error: action.eventsData.message,
      };
    case PRODUCTS_FETCH_ERR:
      return { ...state, fetching: false, loginData: null, error: action.error };
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
    url: API_CONFIG.baseUrl + 'products/' + category,
    headers: {
      'Content-Type': 'x-www-form-urlencoded',
    },
  };
  return axios(config);
}

// worker saga: makes the api call when watcher saga sees the action
// the action is automatically passed by TakeLatest
export function* workerProductsSaga(action) {
  try {
    const { payload } = action;
    //in call you have (fn, ...args)
    const response = yield call(fetchProducts, payload.category);

    if (response) {
      yield put({ type: 'PRODUCTS_OK', payload: { category: payload.category, data: response.data } });
    }
  } catch (err) {
    console.error(err);
    //we need to serialize the Error obj
    const error = err.response.data; //todo refacror here with proxy
    // dispatch a failure action to the store with the error
    yield put({ type: 'PRODUCTS_FETCH_ERR', error });
  }
}
