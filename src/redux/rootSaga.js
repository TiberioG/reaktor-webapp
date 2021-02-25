import { all } from 'redux-saga/effects';
import { watcherProductsSaga } from '../api/productsSaga';

export default function* rootSaga() {
  yield all([watcherProductsSaga()]);
}
