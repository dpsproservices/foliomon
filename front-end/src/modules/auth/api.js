const API_URL = process.env.REACT_APP_API_URL;
const axios = require('axios');

// Register new user
export const postSignUp = async (body) => {
    const url = `${API_URL}/register`;
    return await axios.post(url, body);
};

// Login user
export const postSignIn = async (body) => {
    const url = `${API_URL}/login`;
    return await axios.post(url, body);
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