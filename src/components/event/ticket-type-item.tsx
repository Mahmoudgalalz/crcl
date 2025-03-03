/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { AnEvent, Ticket } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TicketTypeForm } from "./ticket-type-form";
import { updateTicketType } from "@/lib/api/events";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

export function TicketTypeItem({
  ticket,
  remainingEventCapacity,
  onDelete,
  disabled,
  eventId,
}: {
  ticket: Ticket;
  remainingEventCapacity: number;
  onDelete: UseMutateFunction<boolean, Error, string, { previousData: { event: AnEvent } }>;
  disabled?: boolean;
  eventId: string;
}) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate } = useMutation({
    mutationFn: (formValues: Partial<Ticket>) =>
      updateTicketType({
        ...formValues,
        id: ticket.id,
      } as Ticket),
    onMutate: async (formValues) => {
      await queryClient.cancelQueries({ queryKey: ["event", eventId] });
      const previousEvents: { event: AnEvent } = queryClient.getQueryData<any>(["event", eventId]);
      queryClient.setQueriesData(
        { queryKey: ["event", eventId] },
        (old: { event: AnEvent }) => {
          return {
            event: {
              ...old.event,
              tickets: old.event.tickets.map((t: Ticket) =>
                t.id === formValues.id ? formValues : t
              ),
            },
          };
        }
      );
      return { previousEvents };
    },
    onError: (err, newTicket, context) => {
      queryClient.setQueriesData(
        { queryKey: ["events"] },
        context?.previousEvents
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onSuccess: (updatedTicket) => {
      console.log(updatedTicket);
      console.log(ticket);
      return updatedTicket;
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger disabled={disabled}>
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Price:</span>
              <span>{ticket.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span>{ticket.capacity}</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ticket Type</DialogTitle>
          <DialogDescription>Edit this ticket type</DialogDescription>
        </DialogHeader>
        <TicketTypeForm
          remainingEventCapacity={remainingEventCapacity}
          onSubmitFn={async (formValues) => {
            console.log(formValues);
            if (formValues.id) {
              mutate(formValues as Partial<Ticket>);
            }
            setDialogOpen(false);
          }}
          initialData={ticket}
          onDeleteFn={() => {
            if (ticket.id) {
              onDelete(ticket.id);
            }
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
