import axios from "axios";

let redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/Login";
  }
};

export const createAxiosInstance = (token) => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
