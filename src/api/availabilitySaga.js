import { takeEvery, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';

const parser = new DOMParser();

// action types
const AVAILABILITY_REQ = 'AVAILABILITY_REQ';
const AVAILABILITY_OK = 'AVAILABILITY_OK';
const AVAILABILITY_ERROR = 'AVAILABILITY_ERROR';

const RETRIES = 3; //set here the max number of API call retries

/*
Small function to parse the ugly response of the Availability server into an object
*/
const arrayToObject = array =>
  array.reduce((obj, item) => {
    //parse from XML
    const parsed = parser.parseFromString(item.DATAPAYLOAD, 'text/xml');

    obj[item.id.toLowerCase()] = {
      code: parsed.getElementsByTagName('CODE')[0].childNodes[0].nodeValue,
      inStockValue: parsed.getElementsByTagName('INSTOCKVALUE')[0].childNodes[0]
        .nodeValue,
    };
    return obj;
  }, {});

const initialState = {};

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
        },
      };
    case AVAILABILITY_OK:
      return {
        ...state,
        [payload.manufacturer]: {
          ready: true,
          fetching: false,
          error: null,
          data: arrayToObject(payload.data),
        },
      };

    case AVAILABILITY_ERROR:
      return {
        ...state,
        [payload.manufacturer]: {
          fetching: false,
          error: payload.error,
        },
      };
    default:
      return state;
  }
}

// this is responsible of calling API
function fetchAvailability(manufacturer) {
  let config = {
    method: 'get',
    url: '/v2/' + 'availability/' + manufacturer,
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
export function* workerAvailabilitySaga(action) {
  const { payload } = action;
  try {
    const apiData = yield call(_retryApi, payload);

    yield put({
      type: 'AVAILABILITY_OK',
      payload: { manufacturer: payload.manufacturer, data: apiData.response },
    });
  } catch (error) {
    //console.log(error);
    yield put({
      type: 'AVAILABILITY_ERROR',
      payload: { manufacturer: payload.manufacturer, error: error },
    });
  }
}

function* _retryApi(payload) {
  for (let i = 0; i < RETRIES; i++) {
    try {
      //in call you have (fn, ...args)
      const response = yield call(fetchAvailability, payload.manufacturer);
      if (response) {
        //because the api when brokes still sends 200 code but the response is a string, not an empty array!
        if (response.data.code === 200 && response.data.response !== '[]') {
          //console.log(response.data);
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

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* watcherAvailabilitySaga() {
  yield takeEvery('AVAILABILITY_REQ', workerAvailabilitySaga);
}
