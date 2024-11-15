import { Analytics } from "../types";
import { axiosInstance } from "./instance";

export async function getAnalytics(fromDate: Date, toDate: Date) {
  try {
    const response = await axiosInstance.get<Analytics>(
      `/analytics?all=true&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );

    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
