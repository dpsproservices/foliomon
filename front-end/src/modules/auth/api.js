const API_URL = process.env.REACT_APP_API_URL;
const axios = require('axios');

// Register new user
export const postSignUp = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
            }
        };
        const url = `${API_URL}/register`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'User with email already exists.' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Incorrect email or password.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'User does not have access.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable. Contact Support.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error. Contact Support.' };
        }
    } catch (err) {
        console.log(`Error in api.auth.postSignUp: ${err.message}`);
        throw err;
    }
};

// Login user
export const postSignIn = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
            }
        };
        const url = `${API_URL}/login`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'Incorrect email or password.' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Incorrect email or password.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'User does not have access.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable. Contact Support.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error. Contact Support.' };
        }
    } catch (err) {
        console.log(`Error in api.auth.postSignIn: ${err.message}`);
        throw err;
    }
};

// Logout user
export const postSignOut = async () => {
    const url = `${API_URL}/logout`;
    return await axios.post(url);
};

// user Forgot Password
export const postForgotPassword = async () => {
    const url = `${API_URL}/forgot`;
    return await axios.post(url);
};