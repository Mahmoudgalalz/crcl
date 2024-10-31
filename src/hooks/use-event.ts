import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTicketType,
  deleteTicketType,
  getEvent,
  updateEvent,
} from "@/lib/api/events";
import { useState } from "react";
import type { Ticket, AnEvent } from "@/lib/types";

export const useEvent = ({ params }: { params: { id: string } }) => {
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [addTicketTypeDialogOpen, setAddTicketTypeDialogOpen] = useState(false);
  const [eventStatusDialog, setEventStatusDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: event } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getEvent(params.id),
    select: (data) => data.event,
  });

  const remainingEventCapacity =
    event?.capacity &&
    event?.tickets &&
    event.capacity -
      event.tickets.reduce((acc, ticket) => acc + ticket.capacity, 0);

  const { mutate: mutateEvent } = useMutation({
    mutationKey: ["event", params.id],
    mutationFn: async (formValues: Partial<AnEvent>) => {
      try {
        return await updateEvent(
          {
            ...formValues,
          } as AnEvent,
          params.id
        );
      } catch (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event");
      }
    },
    onSuccess: async (newEventData) => {
      console.log(newEventData);
      await queryClient.cancelQueries({ queryKey: ["event", params.id] });

      const previousEvent = queryClient.getQueryData(["event", params.id]);
      const eventsData = queryClient.getQueryData(["events"]) as {
        events: AnEvent[];
      };
      const events = eventsData?.events ?? [];

      queryClient.setQueryData(["events"], {
        events: events.map((event) => {
          if (event.id === params.id) {
            return {
              ...event,
              ...newEventData,
            };
          }
          return event;
        }),
      });

      queryClient.setQueryData(["event", params.id], {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        event: { ...newEventData, tickets: previousEvent.event.tickets },
      });

      return { previousEvent };
    },
  });

  const { mutate: createTicket } = useMutation({
    mutationKey: ["event", params.id, "createTicket"],
    mutationFn: async (formValues: Partial<Ticket>) => {
      try {
        return await createTicketType(formValues as Ticket, event?.id ?? "");
      } catch (error) {
        console.error("Error create ticket:", error);
        throw new Error("Failed to create ticket");
      }
    },
    onMutate: async (newTicketData) => {
      await queryClient.cancelQueries({ queryKey: ["event", params.id] });

      const previousEvent = queryClient.getQueryData(["event", params.id]);

      queryClient.setQueryData(["event", params.id], {
        event: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ...previousEvent.event,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          tickets: [...previousEvent.event.tickets, newTicketData],
        },
      });

      return { previousEvent };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["event", params.id], context?.previousEvent);
    },
    onSuccess: () => {
      setAddTicketTypeDialogOpen(false);
    },
  });

  const { mutate: removeTicketType } = useMutation({
    mutationKey: ["event", params.id, "deleteTicket"],
    mutationFn: async (id: string) => {
      console.log("Starting mutation with id:", id); // Debug log
      const response = await deleteTicketType(`/events/tickets/${id}`);
      if (!response) {
        throw new Error("Failed to delete ticket");
      }
      return response;
    },
    onMutate: async (newTicketData) => {
      await queryClient.cancelQueries({ queryKey: ["event", params.id] });

      const previousEvent = queryClient.getQueryData(["event", params.id]);

      queryClient.setQueryData(["event", params.id], {
        event: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ...previousEvent.event,
          tickets:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            previousEvent.event.tickets.filter((t) => t.id !== newTicketData),
        },
      });

      return { previousEvent };
    },
  });

  const image =
    process.env.NODE_ENV === "production"
      ? event?.image
      : event?.image?.replace("https", "http");

  return {
    event,
    image,
    editEventDialogOpen,
    setEditEventDialogOpen,
    mutateEvent,
    eventStatusDialog,
    setEventStatusDialog,
    addTicketTypeDialogOpen,
    setAddTicketTypeDialogOpen,
    createTicket,
    remainingEventCapacity,
    deleteTicketType: removeTicketType,
  };
};
