import { axiosInstance } from "./instance";
import { ApiSuccessResponse } from "@/lib/types";

export async function login(username: string, password: string) {
  const res = await axiosInstance.post<
    ApiSuccessResponse<{
      access_token: string;
    }>
  >("/auth/admin/login", {
    admin: username,
    password: password,
  });

  if (res.data.status === "success") {
    localStorage.setItem("token", res.data.data.access_token);
  } else {
    throw new Error("Invalid username or password");
  }

  return true;
}

export async function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
