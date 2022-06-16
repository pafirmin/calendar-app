import Axios from "axios";

const axios = Axios.create({
  headers: {
    'content-type': 'application/json'
  }
});

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');

  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
});

axios.interceptors.response.use((response) => response, async (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
      case 401:
      case 403:
      case 404:
      case 500:
        return Promise.reject(error.response.data)
      default:
        return Promise.reject(error)
    };
  }

  return Promise.reject({message: error.message});
});

export default axios;
