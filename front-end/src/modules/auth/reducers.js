import {
    //REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,

    //LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,

    //LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_ERROR,

    //FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR
} from './actions';

const initialState = {
    authenticated: '',
    errorMessage: ''
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_SUCCESS:
            localStorage.setItem('token', action.payload.data.token);
            return { 
                authenticated: action.payload.data.token,
                errorMessage: '' 
            };
        case REGISTER_USER_ERROR:
            localStorage.removeItem('token');
            return { 
                authenticated: '',
                errorMessage: action.payload 
            };
        case LOGIN_USER_SUCCESS:
            localStorage.setItem('token', action.payload.data.token);
            return {
                authenticated: action.payload.data.token,
                errorMessage: ''
            };          
        case LOGIN_USER_ERROR:
            localStorage.removeItem('token');
            return { 
                authenticated: '',
                errorMessage: action.payload
            };
        case LOGOUT_USER_SUCCESS: // reset to initial state
            localStorage.removeItem('token');
            return initialState;
        case LOGOUT_USER_ERROR:
            localStorage.removeItem('token');
            return {
                authenticated: '',
                errorMessage: action.payload
            };
        case FORGOT_PASSWORD_SUCCESS:
            localStorage.setItem('token', action.payload.data.token);
            return {
                authenticated: action.payload.data.token,
                errorMessage: ''
            };
        case FORGOT_PASSWORD_ERROR:
            localStorage.removeItem('token');
            return {
                authenticated: '',
                errorMessage: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;