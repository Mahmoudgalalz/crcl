// import { createSession } from "../session";
import { loginServer, logoutServer } from "../actions";
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
    loginServer(res.data.data.access_token);
    localStorage.setItem("token", res.data.data.access_token);
  } else {
    throw new Error("Invalid username or password");
  }

  return true;
}

export async function logout() {
  logoutServer();
  localStorage.removeItem("token");
  window.location.href = "/";
}
