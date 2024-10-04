import { SuperUser } from "../types";
import { axiosInstance } from "./instance";

export async function createAdmin(admin: SuperUser) {
  try {
    const response = await axiosInstance.post<SuperUser>("/admin", admin);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: SuperUser;
    };
  }
}

export async function deleteAdmin(id: string) {
  try {
    const response = await axiosInstance.delete<SuperUser>(`/admin/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: SuperUser;
    };
  }
}

export async function changePasswordAdmin(id: string, newPassword: string) {
  try {
    const response = await axiosInstance.patch<SuperUser>(`/admin/${id}`, {
      password: newPassword,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: SuperUser;
    };
  }
}
