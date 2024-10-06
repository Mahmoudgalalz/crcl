import { isAxiosError } from "axios";
import { axiosInstance } from "./instance";

export async function login(email: string, password: string) {
  try {
    const res = await axiosInstance.post("/auth/admin/login", {
      email,
      password,
    });

    console.log(res.data);

    if (res.status === 200) {
      localStorage.setItem("token", res.data.data.access_token);
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
}
