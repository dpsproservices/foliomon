const API_URL = process.env.REACT_APP_API_URL;
const axios = require('axios');

// Register new user
export const postSignUp = async (body) => {
    const url = `${API_URL}/signup`;
    return await axios.post(url, body);
};

// Login user
export const postSignIn = async (body) => {
    const url = `${API_URL}/signin`;
    return await axios.post(url, body);
};

// Logout user
export const postSignOut = async () => {
    const url = `${API_URL}/signout`;
    return await axios.post(url);
};