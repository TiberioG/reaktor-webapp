import { takeEvery, call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import API_CONFIG from './API-config.json';
import { availableCategories } from '../redux/categoriesSlice';

// action types
const AVAILABILITY_REQ = 'AVAILABILITY_REQ';
const AVAILABILITY_OK = 'AVAILABILITY_OK';
const AVAILABILITY_KO = 'AVAILABILITY_KO'; // this if axios fetch was ok but server returns error
const AVAILABILITY_FETCH_ERR = 'AVAILABILITY_FETCH_ERR'; // this if we catch an error from axios fetch

const parser = new DOMParser();

const arrayToObject = array =>
  array.reduce((obj, item) => {
    const parsed = parser.parseFromString(item.DATAPAYLOAD, 'text/xml');

    obj[item.id.toLowerCase()] = {
      code: parsed.getElementsByTagName('CODE')[0].childNodes[0].nodeValue,
      inStockValue: parsed.getElementsByTagName('INSTOCKVALUE')[0].childNodes[0].nodeValue,
    };
    return obj;
  }, {});

const initialState = {
  initial: true,
};

//this must be imported in rootReducer
export function availabilityReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case AVAILABILITY_REQ:
      return {
        ...state,
        [payload.manufacturer]: {
          ...state[action.category],
          fetching: true,
          error: null,
        },
      };
    case AVAILABILITY_OK:
      return {
        ...state,
        initial: false,
        [payload.manufacturer]: {
          fetching: false,
          error: null,
          data: arrayToObject(payload.data),
        },
      };

    case AVAILABILITY_KO:
      return {
        ...state,
        fetching: false,
        error: action.eventsData.message,
      };
    case AVAILABILITY_FETCH_ERR:
      return { ...state, fetching: false, loginData: null, error: action.error };
    default:
      return state;
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherAvailabilitySaga() {
  yield takeEvery('AVAILABILITY_REQ', workerAvailabilitySaga);
}

// this is responsible of calling API
function fetchAvailability(manufacturer) {
  let config = {
    method: 'get',
    url: API_CONFIG.baseUrl + 'availability/' + manufacturer,
    headers: {
      'Content-Type': 'x-www-form-urlencoded',
    },
  };
  return axios(config);
}

// worker saga: makes the api call when watcher saga sees the action
// the action is automatically passed by TakeLatest
export function* workerAvailabilitySaga(action) {
  try {
    console.log(action);

    const { payload } = action;
    //in call you have (fn, ...args)
    const response = yield call(fetchAvailability, payload.manufacturer);

    if (response) {
      console.log(response.data);
      if (response.data.code === 200 && response.data.response !== '[]') {
        yield put({
          type: 'AVAILABILITY_OK',
          payload: { manufacturer: payload.manufacturer, data: response.data.response },
        });
      } else yield call;
    }
  } catch (err) {
    console.error(err);
    //we need to serialize the Error obj
    const error = err.response.data; //todo refacror here with proxy
    // dispatch a failure action to the store with the error
    yield put({ type: 'AVAILABILITY_FETCH_ERR', error });
  }
}
