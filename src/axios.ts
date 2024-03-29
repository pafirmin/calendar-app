import Axios from "axios";
import { StatusCodes } from "http-status-codes";
import { ValidationFailedResponse } from "./common/types";

const axios = Axios.create({
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (config && config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;

    if (error.response) {
      switch (error.response.status) {
        case StatusCodes.UNPROCESSABLE_ENTITY:
          return Promise.reject({
            status: error.response.status,
            message: error.response.data.message,
            fields: error.response.data.fields,
          } as ValidationFailedResponse<any>);
        case StatusCodes.UNAUTHORIZED:
          if (
            config._retry ||
            config.url === "/auth/refresh-token" ||
            config.url === "/auth/login"
          ) {
            return Promise.reject({
              status: error.response.status,
              message: error.response.data.message,
            });
          }

          config._retry = true;

          const res = await axios.get("/auth/refresh-token");
          const token = res.data.access_token;

          localStorage.setItem("access_token", token);

          return axios(config);
        default:
          return Promise.reject({
            status: error.response.status,
            message: error.response.data.message,
          });
      }
    }

    return Promise.reject({ message: error.message });
  }
);

export default axios;
