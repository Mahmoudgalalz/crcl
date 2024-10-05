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

export function TicketTypeItem({
  ticket,
  remainingEventCapacity,
}: {
  ticket: Ticket;
  remainingEventCapacity: number;
}) {
  return (
    <Dialog>
      <DialogTrigger>
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
            await updateTicketType(formValues as unknown as Ticket, ticket.id);
            console.log(ticket);
          }}
          initialData={ticket}
        />
      </DialogContent>
    </Dialog>
  );
}
