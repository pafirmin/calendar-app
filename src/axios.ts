import Axios from "axios";
import { store } from "./app/store";
import { logout } from "./features/auth/auth.slice";

const axios = Axios.create({
  headers: {
    "content-type": "application/json",
  },
});

axios.defaults.baseURL = "http://localhost:4000/api/v1";

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (config && config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch(logout());
          localStorage.clear();
          break;
        default:
          break;
      }

      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message,
      });
    }
    return Promise.reject({ message: error.message });
  }
);

export default axios;
