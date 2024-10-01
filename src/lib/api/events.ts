import { AnEvent, ApiSuccessResponse } from "../types";
import axiosInstance from "./instance";

export async function getEvents() {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        events: AnEvent[];
        total: number;
      }>
    >("/events");
    const data: {
      events: AnEvent[];
      total: number;
    } = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    return [] as unknown as {
      events: AnEvent[];
      total: number;
    };
  }
}
