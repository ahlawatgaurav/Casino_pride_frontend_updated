import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9004/api",
  headers: {
    Authorization: process.env.REACT_APP_AUTHORIZATION,
  },
});
