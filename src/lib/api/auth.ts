import { isAxiosError } from "axios";
import { axiosInstance } from "./instance";
import { ApiSuccessResponse } from "../types";

export async function login(email: string, password: string) {
  try {
    const res = await axiosInstance.post<
      ApiSuccessResponse<{
        access_token: string;
      }>
    >(
      "/auth/admin/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: null,
        },
      }
    );

    console.log(res.data);

    if (res.data.status === "success") {
      localStorage.setItem("token", res.data.data.access_token);
      localStorage.setItem("email", email);
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
  localStorage.removeItem("token");
  localStorage.removeItem("email");
}
