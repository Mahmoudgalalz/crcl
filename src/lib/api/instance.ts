import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:2002",
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});
