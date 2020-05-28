import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer, rootSaga } from './modules';

import createReduxPromiseListener from 'redux-promise-listener';

const reduxPromiseListener = createReduxPromiseListener();

const logger = store => (next) => (action) => {
    console.log(action);
    return next(action);
}

const sagaMiddleware = createSagaMiddleware();

var middleware = applyMiddleware(
    sagaMiddleware,
    reduxPromiseListener.middleware,
    logger
);

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
    auth: { appAuthToken: localStorage.getItem('appAuthToken') },
    account: { accountId: localStorage.getItem('accountId') }
};

export default createStore(
    rootReducer,
    initialState,
    composeEnhancers(middleware)
);

export const promiseListener = reduxPromiseListener;

sagaMiddleware.run(rootSaga);