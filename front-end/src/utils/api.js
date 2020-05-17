const API_URL = process.env.REACT_APP_API_URL;
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

export const getAccount = async (accountId) => {
  const url = `${API_URL}/accounts/${accountId}`;
  return await axios.get(url);
};

export const getUser = async () => {
  const url = `${API_URL}/user`;
  return await axios.get(url);
};

// Get Streamer Subscription Keys
export const getUserSubscriptionKeys = async (body) => {
  const url = `${API_URL}/user/sub`;
  return await axios.post(url, body);
};

// only use this in cases app data needs to be reset
export const resetAccounts = async () => {
  const url = `${API_URL}/accounts/reset`;
  return await axios.post(url);
};

export const getAccountPositions = async (accountId) => {
  const url = `${API_URL}/accounts/${accountId}/positions`;
  return await axios.get(url);
};

export const getOrders = async () => {
  const url = `${API_URL}/orders`;
  return await axios.get(url);
};

export const getAccountOrders = async (accountId) => {
  const url = `${API_URL}/orders/${accountId}`;
  return await axios.get(url);
};

export const getOrder = async (accountId,orderId) => {
  const url = `${API_URL}/orders/${accountId}/${orderId}`;
  return await axios.get(url);
};

export const getMarketHours = async (market) => {
  const url = `${API_URL}/marketdata/hours/${market}`; // EQUITY, OPTION, FUTURE, BOND, or FOREX
  return await axios.get(url);
};

export const getInstruments = async (body) => {
  const url = `${API_URL}/marketdata/instruments`;
  return await axios.post(url, body);
};

export const getPriceHistory = async (body) => {
  const url = `${API_URL}/marketdata/pricehistory`;
  return await axios.post(url, body);
};

export const getDailyPriceHistory = async (symbol) => {
  const url = `${API_URL}/marketdata/pricehistory/${symbol}/daily`;
  return await axios.get(url);
};

export const getMinutePriceHistory = async (symbol) => {
  const url = `${API_URL}/marketdata/pricehistory/${symbol}/minute`;
  return await axios.get(url);
};

export const getMovers = async (body) => {
  const url = `${API_URL}/marketdata/movers`;
  return await axios.post(url, body);
};

export const getWatchlists = async () => {
  const url = `${API_URL}/watchlists`;
  return await axios.get(url);
};

export const getAccountWatchlists = async (accountId) => {
  const url = `${API_URL}/watchlists/${accountId}`;
  return await axios.get(url);
};

export const getAccountWatchlist = async (accountId, watchlistId) => {
  const url = `${API_URL}/watchlists/${accountId}/${watchlistId}`;
  return await axios.get(url);
};

export const createAccountWatchlist = async (accountId, req) => {
  const url = `${API_URL}/watchlists/${accountId}`;
  return await axios.post(url, req);
};

export const deleteAccountWatchlist = async (accountId, watchlistId) => {
  const url = `${API_URL}/watchlists/${accountId}/${watchlistId}`;
  return await axios.delete(url);
};

export const replaceAccountWatchlist = async (accountId, watchlistId, req) => {
  const url = `${API_URL}/watchlists/${accountId}/${watchlistId}`;
  return await axios.put(url, req);
};

export const getAccountTransactions = async (accountId, months) => {
  const url = `${API_URL}/transactions/${accountId}/${months}`;
  return await axios.get(url);
};