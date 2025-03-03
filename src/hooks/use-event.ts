import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTicketType,
  deleteTicketType,
  getEvent,
  updateEvent,
} from "@/lib/api/events";
import { useState } from "react";
import type { Ticket, AnEvent, SuperUserType, TicketAggregates } from "@/lib/types";
import { useToast } from "./use-toast";

export const useEvent = ({ params }: { params: { id: string } }) => {
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [addTicketTypeDialogOpen, setAddTicketTypeDialogOpen] = useState(false);
  const [eventStatusDialog, setEventStatusDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: responseData = { event: undefined, ticketsAggregate: [] } } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getEvent(params.id),
    select: (data) => data,
  });

  const { event, ticketsAggregate } = responseData;

  const remainingEventCapacity =
    event?.capacity &&
    event?.tickets &&
    event.capacity -
      event.tickets.reduce((acc, ticket) => acc + ticket.capacity, 0);

  // Helper function to get the ticket sales data
  const getTicketSalesData = (ticketId: string) => {
    const aggregateData = ticketsAggregate?.find(agg => agg.ticket.id === ticketId);
    return aggregateData?.paymentStatusCounts || {};
  };

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
      await queryClient.cancelQueries({ queryKey: ["event", params.id] });

      const previousData = queryClient.getQueryData(["event", params.id]) as {
        event: AnEvent;
        ticketsAggregate: TicketAggregates[];
      };
      const eventsData = queryClient.getQueryData(["events"]) as {
        events: AnEvent[];
        ticketsAggregate: TicketAggregates[];
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
        event: { ...newEventData, tickets: previousData.event.tickets },
        ticketsAggregate: previousData.ticketsAggregate
      });

      return { previousData };
    },
  });

  // Update other mutations to preserve ticketsAggregate data when modifying state
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

      const previousData = queryClient.getQueryData(["event", params.id]) as {
        event: AnEvent;
        ticketsAggregate: TicketAggregates[];
      };

      queryClient.setQueryData(["event", params.id], {
        event: {
          ...previousData.event,
          tickets: [...previousData.event.tickets, newTicketData],
        },
        ticketsAggregate: previousData.ticketsAggregate
      });

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["event", params.id], context?.previousData);
    },
    onSuccess: () => {
      // Invalidate and refetch to get updated ticketsAggregate
      queryClient.invalidateQueries({ queryKey: ["event", params.id] });
      setAddTicketTypeDialogOpen(false);
    },
  });

  const { mutate: removeTicketType } = useMutation({
    mutationKey: ["event", params.id, "deleteTicket"],
    mutationFn: async (id: string) => {
      const response = await deleteTicketType(id);
      if (!response) {
        throw new Error("Failed to delete ticket");
      }
      return response;
    },
    onMutate: async (ticketId) => {
      await queryClient.cancelQueries({ queryKey: ["event", params.id] });

      const previousData = queryClient.getQueryData(["event", params.id]) as {
        event: AnEvent;
        ticketsAggregate: TicketAggregates[];
      };

      queryClient.setQueryData(["event", params.id], {
        event: {
          ...previousData.event,
          tickets: previousData.event.tickets.filter((t) => t.id !== ticketId),
        },
        ticketsAggregate: previousData.ticketsAggregate // Preserve ticketsAggregate until refetch
      });

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["event", params.id], context?.previousData);
      toast({
        variant: "destructive",
        title: "Unable to delete ticket type",
        description:
          "An error occurred while deleting ticket type, it has been booked already",
      });
    },
    onSuccess: () => {
      // Invalidate and refetch to get updated ticketsAggregate
      queryClient.invalidateQueries({ queryKey: ["event", params.id] });
    }
  });

  const image = event?.image?.replace("localhost:2002", "api.crclevents.com");

  const userType = localStorage.getItem("type") as SuperUserType;

  const isEditDisabled = userType !== "ADMIN";

  return {
    event,
    ticketsAggregate,
    getTicketSalesData, // Expose this helper function
    image,
    editEventDialogOpen,
    setEditEventDialogOpen,
    mutateEvent,
    eventStatusDialog,
    setEventStatusDialogOpen,
    addTicketTypeDialogOpen,
    setAddTicketTypeDialogOpen,
    createTicket,
    remainingEventCapacity,
    deleteTicketType: removeTicketType,
    isEditDisabled,
  };
};
