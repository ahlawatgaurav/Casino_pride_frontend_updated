import axios from "axios";



const AUTH_TOKEN_KEY = "AuthToken";

const attachInterceptors = (client) => {
  client.interceptors.request.use((config) => {
    const tokenFromStorage = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!config.headers?.AuthToken && tokenFromStorage) {
      config.headers = {
        ...(config.headers || {}),
        AuthToken: tokenFromStorage,
      };
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      const errorCode = response?.data?.Error?.ErrorCode;
      if (errorCode === 10003) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );
};

const api = {
  BILLING_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BILLING_URL_HTTPS}/api`,
    headers: {
      Authorization: process.env.REACT_APP_AUTHORIZATION,
    },
  }),
  

  BOOKING_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_BOOKING_URL_HTTPS}/api`,
    headers: {
      Authorization: process.env.REACT_APP_AUTHORIZATION,
    },
  }),

  CORE_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_CORE_URL_HTTPS}/api`,
    headers: {
      Authorization: process.env.REACT_APP_AUTHORIZATION,
    },
  }),

  AUTH_PORT: axios.create({
    baseURL: `${process.env.REACT_APP_AUTH_URL_HTTPS}/api`,
    headers: {
      Authorization: process.env.REACT_APP_AUTHORIZATION,
    },
  }),
};

Object.values(api).forEach((client) => attachInterceptors(client));

export default api;
