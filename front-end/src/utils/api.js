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

export const getAccounts = async () => {
  const url = `${API_URL}/accounts`;
  return await axios.get(url);
};

export const refreshAccounts = async () => {
  const url = `${API_URL}/accounts/refresh`;
  return await axios.get(url);
};

export const getAccountPositions = async (accountId) => {
  const url = `${API_URL}/accounts/${accountId}/positions`;
  return await axios.get(url);
};

export const getAllOrders = async () => {
  const url = `${API_URL}/orders`;
  return await axios.get(url);
};

export const getAccountOrders = async (accountId) => {
  const url = `${API_URL}/orders/${accountId}`;
  return await axios.get(url);
};

export const getAccountOrder = async (accountId,orderId) => {
  const url = `${API_URL}/orders/${accountId}/${orderId}`;
  return await axios.get(url);
};