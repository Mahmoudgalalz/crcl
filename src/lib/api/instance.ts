import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
};

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const currentToken = getLocalStorageItem("token");
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
