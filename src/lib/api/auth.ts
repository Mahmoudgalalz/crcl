import { isAxiosError } from "axios";
import { axiosInstance } from "./instance";
import type { ApiSuccessResponse, SuperUserType } from "../types";

export async function login(email: string, password: string) {
  try {
    const res = await axiosInstance.post<
      ApiSuccessResponse<{
        access_token: string;
        type: SuperUserType;
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

    if (res.data.status === "success") {
      console.log(res.data.data.type);
      localStorage.setItem("token", res.data.data.access_token);
      localStorage.setItem("email", email);
      localStorage.setItem("type", res.data.data.type);
      return {
        status: true,
        type: res.data.data.type,
      };
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
  localStorage.removeItem("type");
}
