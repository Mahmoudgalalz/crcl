import { User } from "../types";
import { axiosInstance } from "./instance";

export async function getOps() {
  try {
    const resForBooth = await axiosInstance.get<{
      status: string;
      message: string;
      data: User[];
    }>("/users?status=ACTIVE&types=BOOTH");

    const resForReader = await axiosInstance.get<{
      status: string;
      message: string;
      data: User[];
    }>("/users?limit=1&status=ACTIVE&types=READER");

    const booth = resForBooth.data.data;
    const reader = resForReader.data.data;
    return [...booth, ...reader];
  } catch (error) {
    console.error(error);
  }
}

export async function createUser(user: Partial<User>) {
  try {
    const res = await axiosInstance.post<User>("/users", user);
    const data = res.data;
    console.log(data, res);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await axiosInstance.delete<User>(`/users/${id}`);
    console.log(res);
    const data: User = res.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
