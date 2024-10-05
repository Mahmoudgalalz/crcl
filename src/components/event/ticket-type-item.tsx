"use client";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Ticket } from "@/lib/types";
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
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function TicketTypeItem({
  ticket,
  remainingEventCapacity,
}: {
  ticket: Ticket;
  remainingEventCapacity: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate, data: updatedTicket } = useMutation({
    mutationKey: ["ticket", ticket.id],
    mutationFn: (formValues: Partial<Ticket>) =>
      updateTicketType({
        ...formValues,
        id: ticket.id,
      } as Ticket),
    onSuccess: (updatedTicket) => {
      return updatedTicket;
    },
  });

  const displayTicket = updatedTicket || ticket;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>{displayTicket.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Price:</span>
              <span>{displayTicket.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span>{displayTicket.capacity}</span>
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
          initialData={displayTicket}
        />
      </DialogContent>
    </Dialog>
  );
}
