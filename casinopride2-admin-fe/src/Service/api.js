import axios from "axios";

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

export default api;
