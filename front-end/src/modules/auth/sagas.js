import { takeLatest, put, call } from 'redux-saga/effects';

import {
    postRegister,
    postLogin,
    postLogout,
    postForgotPassword,
    //getQrData,
    postSetup2fa
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
    FORGOT_PASSWORD_ERROR,

    SETUP_2FA,
    SETUP_2FA_SUCCESS,
    SETUP_2FA_ERROR,
} from './actions';

function* registerSaga(action) {
    try {
        const response = yield call(postRegister, action.payload);
        yield put({ type: REGISTER_USER_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: REGISTER_USER_ERROR, payload: { errorMessage: err.message } });
    }
}

function* loginSaga(action) {
    try {
        const response = yield call(postLogin, action.payload);
        yield put({ type: LOGIN_USER_SUCCESS, payload: response });
    } catch (err) {
        console.log({err});
        yield put({ type: LOGIN_USER_ERROR, payload: { errorMessage: err.message } });
    }
}

function* logoutSaga(action) {
    try {
        const response = yield call(postLogout, action.payload);
        yield put({ type: LOGOUT_USER_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: LOGOUT_USER_ERROR, payload: { errorMessage: err.message } });
    }
}

function* forgotPasswordSaga(action) {
    try {
        const response = yield call(postForgotPassword, action.payload);
        yield put({ type: FORGOT_PASSWORD_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: FORGOT_PASSWORD_ERROR, payload: { errorMessage: err.message } });
    }
}

function* setup2faSaga(action) {
    try {
        const response = yield call(postSetup2fa, action.payload);
        yield put({ type: SETUP_2FA_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: SETUP_2FA_ERROR, payload: { errorMessage: err.message } });
    }
}

export default function* authSaga() {
    yield takeLatest(REGISTER_USER, registerSaga);
    yield takeLatest(LOGIN_USER, loginSaga);
    yield takeLatest(LOGOUT_USER, logoutSaga);
    yield takeLatest(FORGOT_PASSWORD, forgotPasswordSaga);
    yield takeLatest(SETUP_2FA, setup2faSaga);
}