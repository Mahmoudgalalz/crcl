import { StatusBadge } from "@/components/status-badge";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRightCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventRequest, TicketStatus } from "@/lib/types";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

export function TicketReqDetails({
  info,
  changeTicketStatus,
}: {
  info: Row<EventRequest>;
  changeTicketStatus: UseMutateFunction<
    boolean,
    Error,
    {
      ticketId: string;
      newStatus: "APPROVED" | "DECLINED";
      userId: string;
    },
    {
      previousTickets: unknown;
    }
  >;
}) {
  const ticketRequest = info.original;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          View The Request
          <ArrowRightCircle className="ml-2 size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] max-w-5xl">
        <DialogHeader>
          <DialogTitle>Tickets Request Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div>
            Current Status:{" "}
            <StatusBadge status={ticketRequest.status as TicketStatus} />
          </div>
          <div>Number of requested tickets: {ticketRequest.tickets.length}</div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Social</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Ticket Price</TableHead>
              <TableHead>Purchase Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketRequest.tickets.map((ticket, idx) => (
              <TableRow key={`Ticket${idx}for${ticketRequest.id}`}>
                <TableCell>{ticket.requestInfo.name}</TableCell>
                <TableCell>{ticket.requestInfo.email}</TableCell>
                <TableCell>{ticket.requestInfo.number}</TableCell>
                <TableCell>{ticket.requestInfo.social}</TableCell>
                <TableCell>{ticket.ticketInfo.title}</TableCell>
                <TableCell>{ticket.ticketInfo.price}</TableCell>
                <TableCell>
                {ticket.purchaseStatus?.payment ? (
                  <StatusBadge
                    status={ticket.purchaseStatus.payment as TicketStatus}
                  />
                  ) : (
                  "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="mt-4">
          <Button
            className="text-white bg-green-700 rounded-full hover:bg-green-800"
            size="sm"
            disabled={ticketRequest.status === "APPROVED"}
            onClick={() => {
              changeTicketStatus({
                ticketId: ticketRequest.id,
                newStatus: "APPROVED",
                userId: ticketRequest.user.id,
              });
            }}
          >
            <Check className="mr-2 size-4" />
            Approve
          </Button>
          <Button
            className="text-white bg-red-700 rounded-full hover:bg-red-800"
            size="sm"
            disabled={ticketRequest.status === "DECLINED"}
            onClick={() =>
              changeTicketStatus({
                ticketId: ticketRequest.id,
                newStatus: "DECLINED",
                userId: ticketRequest.user.id,
              })
            }
          >
            <X className="mr-2 size-4" />
            Decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
