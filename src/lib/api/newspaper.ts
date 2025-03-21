import { ApiSuccessResponse, Newspaper } from "../types";
import { axiosInstance } from "./instance";

export async function getNewspaper(page: number, search: string) {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        newspapers: Newspaper[];
        total: number;
      }>
    >("/newspaper?limit=6&page=" + page + (search ? `&search=${search}` : ""));
    const data = response.data.data;
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

export async function updateNewspaper(
  id: string,
  formValues: Partial<Newspaper>
) {
  try {
    const response = await axiosInstance.put<ApiSuccessResponse<Newspaper>>(
      `/newspaper/${id}`,
      formValues
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as Newspaper;
  }
}
