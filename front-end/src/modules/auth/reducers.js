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

    //SETUP_2FA,
    SETUP_2FA_SUCCESS,
    SETUP_2FA_ERROR,

    //FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR
} from './actions';

const initialState = {
    appAuthToken: null, // JWT
    //appRefreshToken: null 
    //secret: null, // Google Authenticator secret 
    //qr: null, // Google Authenticator QR image data
    setup2fa: false,

    errorMessage: null // error message from API
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case REGISTER_USER_SUCCESS:
            // passport sent eror status e.g. Unauthorized 401
            if (action.payload.errorMessage) {
                localStorage.removeItem('appAuthToken');
                return {
                    ...state,
                    appAuthToken: null,
                    errorMessage: action.payload.errorMessage
                };
            } else { // user created, passport sent OK 200
                localStorage.setItem('appAuthToken', action.payload.data.appAuthToken);
                return {
                    ...state,
                    appAuthToken: action.payload.data.appAuthToken,
                    errorMessage: null
                };
            }  

        case REGISTER_USER_ERROR:
            localStorage.removeItem('appAuthToken');
            return { 
                ...state,
                appAuthToken: null,
                errorMessage: action.payload 
            };


        case LOGIN_USER_SUCCESS:
            // user email or password are incorrect
            // passport sent eror status e.g. Unauthorized 401
            if (action.payload.errorMessage) {
                localStorage.removeItem('appAuthToken');
                return {
                    ...state,
                    appAuthToken: null,
                    errorMessage: action.payload.errorMessage
                };                
            } else { // login is correct passport sent OK 200
                localStorage.setItem('appAuthToken', action.payload.data.appAuthToken);
                return {
                    ...state,
                    appAuthToken: action.payload.data.appAuthToken,
                    errorMessage: null
                };
            }          
        case LOGIN_USER_ERROR:
            localStorage.removeItem('appAuthToken');
            return { 
                ...state,
                appAuthToken: null,
                errorMessage: action.payload
            };


        case LOGOUT_USER_SUCCESS: // reset to initial state
            localStorage.removeItem('appAuthToken');
            return initialState;
        case LOGOUT_USER_ERROR:
            localStorage.removeItem('appAuthToken');
            return {
                ...state,
                appAuthToken: null,
                errorMessage: action.payload
            };
            

        case SETUP_2FA_SUCCESS:
            // passport sent an error status
            if (action.payload.errorMessage) {
                return {
                    ...state,
                    setup2fa: false,
                    errorMessage: action.payload.errorMessage
                };
            } else { // 2FA was setup, passport sent OK 200
                return {
                    ...state,
                    setup2fa: true,
                    errorMessage: null
                };
            }
        case SETUP_2FA_ERROR:
            return {
                ...state,
                setup2fa: false,
                errorMessage: action.payload
            };


        case FORGOT_PASSWORD_SUCCESS:
            return state;
        case FORGOT_PASSWORD_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            };


        default:
            return state;
    }
};

export default authReducer;