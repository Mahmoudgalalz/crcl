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
