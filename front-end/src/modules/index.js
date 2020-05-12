import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';

import authReducer from './auth/reducers';
import authSaga from './auth/sagas';

// combine all the root reducers of each module here
export const rootReducer = combineReducers({
    auth: authReducer
});

// fork all the root saga of each module here
export function* rootSaga() {
    yield fork(authSaga);
}