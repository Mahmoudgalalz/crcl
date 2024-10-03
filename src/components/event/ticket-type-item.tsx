import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { AnEvent } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TicketTypeForm } from "./ticket-type-form";
import { cookies } from "next/headers";

export function TicketTypeItem({
  ticket,
  remainingEventCapacity,
}: {
  ticket: AnEvent["tickets"][0];
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
          onSubmitFn={async (data) => {
            "use server";
            const res = await fetch(
              `http://localhost:2002/events/tickets/${ticket.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${cookies().get("token")?.value}`,
                },
                body: JSON.stringify({
                  ...data,
                }),
              }
            ).then((res) => res.json());

            return res;
          }}
          initialData={ticket}
        />
      </DialogContent>
    </Dialog>
  );
}
