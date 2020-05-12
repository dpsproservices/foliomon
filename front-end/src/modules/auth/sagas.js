import { takeLatest, put, call } from 'redux-saga/effects';

import {
    postSignUp,
    postSignIn,
    postSignOut
} from './api';

import {
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,

    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,

    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_ERROR
} from './actions';

function* registerSaga(formProps) {
    try {
        const response = yield call(postSignUp, formProps);
        yield put({ type: REGISTER_USER_SUCCESS, response: response });
    } catch (err) {
        yield put({ type: REGISTER_USER_ERROR, errorMessage: err.message });
    }
}

function* loginSaga(formProps) {
    try {
        const response = yield call(postSignIn, formProps);
        yield put({ type: LOGIN_USER_SUCCESS, response: response });
    } catch (err) {
        yield put({ type: LOGIN_USER_ERROR, errorMessage: err.message });
    }
}

function* logoutSaga(formProps) {
    try {
        const response = yield call(postSignOut, formProps);
        yield put({ type: LOGOUT_USER_SUCCESS, response: response });
    } catch (err) {
        yield put({ type: LOGOUT_USER_ERROR, errorMessage: err.message });
    }
}

/*
function* forgotPasswordSaga(formProps) {
    try {
        const response = yield call(forgotPassword, formProps);
        yield put({ type: FORGOT_PASSWORD_SUCCESS, response: response });
    } catch (err) {
        yield put({ type: FORGOT_PASSWORD_ERROR, errorMessage: err.message });
    }
}
*/

export default function* authSaga() {
    yield takeLatest(REGISTER_USER, registerSaga);
    yield takeLatest(LOGIN_USER, loginSaga);
    yield takeLatest(LOGOUT_USER, logoutSaga);
}