"use client";
import axios from "axios";

let token;

if (localStorage) token = localStorage.getItem("token");

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
