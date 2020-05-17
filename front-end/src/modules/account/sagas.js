import { fork } from 'redux-saga/effects';

export function* handleActions() {
  //while (true) {
    //const action = yield takex(/^FETCH_/);
    //console.log('handle', action.type);
  //}
}
  
export default function* rootSaga() {
  yield fork(handleActions);
}