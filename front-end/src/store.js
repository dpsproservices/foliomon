import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer, rootSaga } from './modules';

const sagaMiddleware = createSagaMiddleware();

var middleware = applyMiddleware(sagaMiddleware);

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
    auth: { authenticated: localStorage.getItem('token') }
};

export default createStore(
    rootReducer,
    initialState,
    composeEnhancers(middleware)
);

sagaMiddleware.run(rootSaga);