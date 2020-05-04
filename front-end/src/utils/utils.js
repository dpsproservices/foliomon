//export const NODE_ENV = process.env.NODE_ENV || 'development';

//export const PORT = process.env.PORT || 443;

export const API_URL = `https://localhost:4000/foliomon`;

export const convertCase = (str) => {
  if (!str) return;

  return str[0].toUpperCase() + str.slice(1).toLowerCase().replace('_', ' ');
};

export const numberWithCommas = (x) => {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}