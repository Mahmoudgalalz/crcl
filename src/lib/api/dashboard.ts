import type { Analytics, BoothAnalytics } from "../types";
import { axiosInstance } from "./instance";

export async function getGeneralAnalytics(fromDate: Date, toDate: Date) {
  try {
    const response = await axiosInstance.get<Analytics>(
      `/analytics?all=true&startDate=${
        fromDate.toISOString().split("T")[0]
      }&endDate=${toDate.toISOString().split("T")[0]}`
    );

    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getBoothAnalytics() {
  try {
    const response = await axiosInstance.get<BoothAnalytics>(
      `/analytics/booth`
    );

    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
