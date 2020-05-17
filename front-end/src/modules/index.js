import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';

import authReducer from './auth/reducers';
import authSaga from './auth/sagas';

import accountReducer from './account/reducers';
import accountSaga from './account/sagas';

// combine all the root reducers of each module here
export const rootReducer = combineReducers({
    auth: authReducer,
    account: accountReducer
});

// fork all the root saga of each module here
export function* rootSaga() {
    yield fork(authSaga);
    yield fork(accountSaga);
}