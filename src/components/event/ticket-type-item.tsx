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

export function TicketTypeItem({ ticket }: { ticket: AnEvent["tickets"][0] }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Card>
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
          onSubmitFn={async (data) => {
            "use server";
          }}
          initialData={ticket}
        />
      </DialogContent>
    </Dialog>
  );
}
