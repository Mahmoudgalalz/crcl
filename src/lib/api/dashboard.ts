import { Analytics } from "../types";
import { axiosInstance } from "./instance";

export async function getAnalytics() {
  try {
    const response = await axiosInstance.get<Analytics>(`/analytics?all=true`);

    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
