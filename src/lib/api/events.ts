"use client";
import { AnEvent, ApiSuccessResponse, Ticket, TicketRequest } from "../types";
import { axiosInstance } from "./instance";

export async function getEvents() {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        events: AnEvent[];
        total: number;
      }>
    >("/events?limit=50");
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
  console.log(event);
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
  console.log(event);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...ticketData } = ticket;
  try {
    const response = await axiosInstance.post(
      `/events/${eventId}/tickets`,
      ticketData
    );
    const data = response.data;
    console.log(response);
    return data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function updateTicketType(ticket: Ticket) {
  console.log(ticket);
  try {
    const response = await axiosInstance.put(
      `/events/tickets/${ticket.id}`,
      ticket
    );
    const data = response.data;
    return data.data;
  } catch (error) {
    console.error(error);
    return {} as unknown as {
      event: AnEvent;
    };
  }
}

export async function deleteTicketType(id: string) {
  try {
    console.log(id);
    const response = await axiosInstance.delete(`/events/tickets/${id}`);
    if (response.status !== 200) {
      throw new Error();
    }
    return response.status === 200 && true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete ticket");
  }
}

export async function getTicketRequets(
  eventId: string,
  page: number,
  searchTerm: string | null
) {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<{
        data: TicketRequest[];
        meta: {
          total: number;
          page: number;
          limit: number;
        };
      }>
    >(
      `/events/${eventId}/requests?page=${page}&limit=10${
        searchTerm && `&search=${searchTerm}`
      }`
    );

    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changeTicketReqStatuss(
  ticketId: string,
  status: "APPROVED" | "DECLINED",
  userId: string
) {
  try {
    const response = await axiosInstance.patch(`/events/requests/${ticketId}`, {
      status,
      userId,
    });
    const data = response.status;
    return data === 200;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
