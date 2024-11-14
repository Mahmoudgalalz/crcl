/* eslint-disable @typescript-eslint/no-explicit-any */

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
import type { AnEvent } from "@/lib/types";
import type { UseMutateFunction } from "@tanstack/react-query";

export function TicketReqDetails({
  info,
  changeTicketStatus,
  event,
}: {
  info: any;
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
  event: AnEvent;
}) {
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
            Current Status: <StatusBadge status={info.row.original.status} />
          </div>
          <div>
            Number of requested tickets: {info.row.original.meta.length}
          </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {info.row.original.meta?.map((reqUser: any, idx: number) => (
              <TableRow key={`ReqUser${idx}for${info.row.original.id}`}>
                <TableCell>{reqUser.name}</TableCell>
                <TableCell>{reqUser.email}</TableCell>
                <TableCell>{reqUser.number}</TableCell>
                <TableCell>{reqUser.social}</TableCell>
                <TableCell>
                  {
                    event?.tickets.find(
                      (ticketType) => ticketType.id === reqUser.ticketId
                    )?.title
                  }
                </TableCell>
                <TableCell>
                  {
                    event?.tickets.find(
                      (ticketType) => ticketType.id === reqUser.ticketId
                    )?.price
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className="mt-4">
          <Button
            className="text-white bg-green-700 rounded-full hover:bg-green-800"
            size="sm"
            disabled={info.row.original.status === "APPROVED"}
            onClick={() => {
              console.log(info.row.original.id);
              changeTicketStatus({
                ticketId: info.row.original.id,
                newStatus: "APPROVED",
                userId: info.row.original.userId,
              });
            }}
          >
            <Check className="mr-2 size-4" />
            Approve
          </Button>
          <Button
            className="text-white bg-red-700 rounded-full hover:bg-red-800"
            size="sm"
            disabled={info.row.original.status === "DECLINED"}
            onClick={() =>
              changeTicketStatus({
                ticketId: info.row.original.id,
                newStatus: "DECLINED",
                userId: info.row.original.userId,
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
