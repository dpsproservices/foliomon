import { API_URL } from './utils';

const axios = require('axios');

export const authorize = async (code) => {
  const url = `${API_URL}/authorize/?code=${code}`;
  return await axios.get(url);
};

export const getAccessToken = async () => {
  const url = `${API_URL}/accesstoken`;
  return await axios.get(url);
};

export const getAllOrders = async () => {
  const url = `${API_URL}/orders`;
  return await axios.get(url);
};