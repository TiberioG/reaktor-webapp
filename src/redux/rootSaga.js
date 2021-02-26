import { all } from 'redux-saga/effects';
import { watcherProductsSaga } from '../api/productsSaga';
import { watcherAvailabilitySaga } from '../api/availabilitySaga';

export default function* rootSaga() {
  yield all([watcherProductsSaga(), watcherAvailabilitySaga()]);
}
