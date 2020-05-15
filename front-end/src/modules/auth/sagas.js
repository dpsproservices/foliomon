import { takeLatest, put, call } from 'redux-saga/effects';

import {
    postSignUp,
    postSignIn,
    postSignOut,
    postForgotPassword
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
    LOGOUT_USER_ERROR,

    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR
} from './actions';

function* registerSaga(action) {
    try {
        const response = yield call(postSignUp, action.payload);
        yield put({ type: REGISTER_USER_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: REGISTER_USER_ERROR, payload: err.message });
    }
}

function* loginSaga(action) {
    try {
        const response = yield call(postSignIn, action.payload);
        yield put({ type: LOGIN_USER_SUCCESS, payload: response });
    } catch (err) {

        console.log({err});
        yield put({ type: LOGIN_USER_ERROR, payload: err.message });
    }
}

function* logoutSaga(action) {
    try {
        const response = yield call(postSignOut, action.payload);
        yield put({ type: LOGOUT_USER_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: LOGOUT_USER_ERROR, payload: err.message });
    }
}

function* forgotPasswordSaga(action) {
    try {
        const response = yield call(postForgotPassword, action.payload);
        yield put({ type: FORGOT_PASSWORD_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: FORGOT_PASSWORD_ERROR, payload: err.message });
    }
}

export default function* authSaga() {
    yield takeLatest(REGISTER_USER, registerSaga);
    yield takeLatest(LOGIN_USER, loginSaga);
    yield takeLatest(LOGOUT_USER, logoutSaga);
    yield takeLatest(FORGOT_PASSWORD, forgotPasswordSaga);
}