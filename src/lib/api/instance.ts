import axios from "axios";
import { decode } from "jsonwebtoken";
import { logout, refreshAccessToken } from "./auth";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const refreshToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refreshToken="));

  if (token) {
    const decodedToken = decode(token);
    if (decodedToken && typeof decodedToken === "object") {
      const { exp } = decodedToken as {
        exp: number;
        iat: number;
        role: "admin" | "user";
        email: string;
        userId: string;
      };
      const currentTime = Date.now() / 1000;

      if (exp < currentTime) {
        if (refreshToken) {
          const newToken = await refreshAccessToken(refreshToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          await logout();
          throw new Error("Token expired and no refresh token available");
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});
