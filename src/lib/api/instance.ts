import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://devapi.crclevents.com",
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
  (response) => {
    console.log("NODE_ENV:", process.env.NODE_ENV);
    return response;
  },
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
    console.log("NODE_ENV:", process.env.NODE_ENV);
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
