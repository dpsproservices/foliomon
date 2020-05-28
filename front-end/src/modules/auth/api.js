const API_URL = process.env.REACT_APP_API_URL;
const axios = require('axios');

/*
// simulate system or network latency
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
*/

// Register new user
export const postRegister = async (body) => {
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
         //sleep(2000); // simulate latency
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
        console.log(`Error in api postRegister: ${err.message}`);
        throw err;
    }
};

// Login user
export const postLogin = async (body) => {
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
        //sleep(2000);
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
        console.log(`Error in api postLogin: ${err.message}`);
        throw err;
    }
};

// Logout user
export const postLogout = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('appAuthToken')
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 404 || status === 503;
            }
        };
        const url = `${API_URL}/logout`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        //sleep(2000);
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'Unexpected Error.' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Unexpected Error.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'Unexpected Error.' };
        } else if (status === 404) { // Not Found
            return { errorMessage: 'User does not exist.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error.' };
        }
    } catch (err) {
        console.log(`Error in api postLogout: ${err.message}`);
        throw err;
    }
};

// user Forgot Password
export const postForgotPassword = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json'
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
            }
        };
        const url = `${API_URL}/forgot`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'Bad Request' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Unauthorized.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'Forbidden.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error.' };
        }
    } catch (err) {
        console.log(`Error in api postSetup2fa: ${err.message}`);
        throw err;
    }
};

// GET the QR secret and image data from passport
export const getQrData = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('appAuthToken')
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
            }
        };
        const url = `${API_URL}/getQrData`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'Bad Request' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Unauthorized.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'Forbidden.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error.' };
        }
    } catch (err) {
        console.log(`Error in api getQrData: ${err.message}`);
        throw err;
    }
};

// setup 2FA
export const postSetup2fa = async (body) => {
    try {
        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': localStorage.getItem('appAuthToken')
            },
            validateStatus: function (status) {
                return status === 200 || status === 400 || status === 401 || status === 403 || status === 503;
            }
        };
        const url = `${API_URL}/setup2fa`;
        const response = await axios.post(url, body, options);
        const status = response.status;
        //const message = response.data.error;
        if (status === 200) {
            return response;
        } else if (status === 400) { // Bad Request
            return { errorMessage: 'Bad Request' };
        } else if (status === 401) { // Unauthorized
            return { errorMessage: 'Unauthorized.' };
        } else if (status === 403) { // Forbidden
            return { errorMessage: 'Forbidden.' };
        } else if (status === 503) { // Service Unavailable
            return { errorMessage: 'Service Unavailable.' };
        } else { // Internal Server Errror
            return { errorMessage: 'Unexpected Error.' };
        }
    } catch (err) {
        console.log(`Error in api postSetup2fa: ${err.message}`);
        throw err;
    }
};

// post auth code to TD Ameritrade API login
/*
export const authorize = async (code) => {
    const url = `${API_URL}/authorize/?code=${code}`;
    return await axios.get(url);
};

export const getAccessToken = async () => {
    const url = `${API_URL}/accesstoken`;
    return await axios.get(url);
};
*/