import { ApiSuccessResponse, Newspaper } from "../types";
import { axiosInstance } from "./instance";

export async function getNewspaper() {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        newspapers: Newspaper[];
        total: number;
      }>
    >("/newspaper");
    const data = response.data.data.newspapers;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createNewspaper(newspaper: Partial<Newspaper>) {
  try {
    const response = await axiosInstance.post<ApiSuccessResponse<Newspaper>>(
      "/newspaper",
      newspaper
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
