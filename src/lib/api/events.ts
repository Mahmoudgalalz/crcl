"use client";
import { AnEvent, ApiSuccessResponse } from "../types";
import { axiosInstance } from "./instance";

export async function getEvents() {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  console.log(token);
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        events: AnEvent[];
        total: number;
      }>
    >("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
