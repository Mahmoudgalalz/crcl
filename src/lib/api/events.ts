"use client";
import { AnEvent, ApiSuccessResponse, Ticket } from "../types";
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

export async function createEvent(event: AnEvent) {
  try {
    const response = await axiosInstance.post("/events", event);
    const data = response.data.data;
    console.log(response);
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function getEvent(id: string) {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        event: AnEvent;
      }>
    >(`/events/${id}`);
    const data: {
      event: AnEvent;
    } = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function updateEvent(event: AnEvent, eventId: string) {
  try {
    const response = await axiosInstance.put(`/events/${eventId}`, event);
    const data = response.data.data;
    console.log(response);
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function createTicketType(ticket: Ticket, eventId: string) {
  try {
    const response = await axiosInstance.post(
      `/events/${eventId}/tickets`,
      ticket
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function updateTicketType(ticket: Ticket, ticketId: string) {
  console.log(ticket.id);
  try {
    const response = await axiosInstance.post(
      `/events/tickets/${ticketId}`,
      ticket
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}
