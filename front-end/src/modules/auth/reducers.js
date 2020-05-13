import {
    //REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,

    //LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,

    //LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_ERROR
} from './actions';

const initialState = {
    authenticated: '',
    errorMessage: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_SUCCESS:
            localStorage.setItem('token', action.response.data.token);
            return { 
                ...state, 
                authenticated: action.response.data.token 
            };
        case REGISTER_USER_ERROR:
            return { 
                ...state, 
                errorMessage: action.errorMessage 
            };
        case LOGIN_USER_SUCCESS:
            localStorage.setItem('token', action.response.data.token);
            return {
                ...state,
                authenticated: action.response.data.token
            };
        case LOGIN_USER_ERROR:
            return { 
                ...state, 
                errorMessage: action.errorMessage
            };
        case LOGOUT_USER_SUCCESS: // reset to initial state
            localStorage.removeItem('token');
            return initialState;
        case LOGOUT_USER_ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage
            };
        default:
            return state;
    }
};

export default authReducer;