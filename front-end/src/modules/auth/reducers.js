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
    authenticated: null,
    errorMessage: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_SUCCESS:
            // passport sent 400 
            if (action.payload.errorMessage) {
                localStorage.removeItem('token');
                return {
                    authenticated: null,
                    errorMessage: action.payload.errorMessage
                };
            } else { // user created, passport sent 200
                localStorage.setItem('token', action.payload.data.token);
                return {
                    authenticated: action.payload.data.token,
                    errorMessage: null
                };
            }  
        case REGISTER_USER_ERROR:
            localStorage.removeItem('token');
            return { 
                authenticated: null,
                errorMessage: action.payload 
            };
        case LOGIN_USER_SUCCESS:
            // user email or password are incorrect
            // passport sent 401
            if (action.payload.errorMessage) {
                localStorage.removeItem('token');
                return {
                    authenticated: null,
                    errorMessage: action.payload.errorMessage
                };                
            } else { // login is correct passport sent 200
                localStorage.setItem('token', action.payload.data.token);
                return {
                    authenticated: action.payload.data.token,
                    errorMessage: null
                };
            }          
        case LOGIN_USER_ERROR:
            localStorage.removeItem('token');
            return { 
                authenticated: null,
                errorMessage: action.payload
            };
        case LOGOUT_USER_SUCCESS: // reset to initial state
            localStorage.removeItem('token');
            return initialState;
        case LOGOUT_USER_ERROR:
            localStorage.removeItem('token');
            return {
                authenticated: null,
                errorMessage: action.payload
            };
        case FORGOT_PASSWORD_SUCCESS:
            //localStorage.setItem('token', action.payload.data.token);
            return {
                authenticated: action.payload.data.token,
                errorMessage: null
            };
        case FORGOT_PASSWORD_ERROR:
            localStorage.removeItem('token');
            return {
                authenticated: null,
                errorMessage: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;