import { isAxiosError } from "axios";
import { loginServer, logoutServer } from "../actions";
import { axiosInstance } from "./instance";

export async function login(email: string, password: string) {
  try {
    const res = await axiosInstance.post("/auth/admin/login", {
      email,
      password,
    });

    console.log(res.data);

    if (res.status === 200) {
      loginServer(res.data.access_token);
      localStorage.setItem("token", res.data.access_token);
      return true;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Invalid username or password"
      );
    }
    throw new Error("Network error. Please try again.");
  }
}
export async function logout() {
  logoutServer();
  localStorage.removeItem("token");
}

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
    {
      refreshToken,
    }
  );
  const { access_token } = response.data;
  localStorage.setItem("token", access_token);
  return access_token;
};
