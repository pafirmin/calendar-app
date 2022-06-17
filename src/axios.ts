import Axios from "axios";
import { store } from "./app/store";
import { logout } from "./features/auth/auth.slice";

const axios = Axios.create({
  headers: {
    "content-type": "application/json",
  },
});

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch(logout());
          localStorage.clear();
          return Promise.reject(error.response.data);
        default:
          return Promise.reject(error.response.data);
      }
    }

    return Promise.reject({ message: error.message });
  }
);

export default axios;
