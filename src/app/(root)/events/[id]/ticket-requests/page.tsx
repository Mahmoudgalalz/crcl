"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowUpRightFromCircleIcon,
  // ArrowUpRightIcon,
  Check,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEvent,
  getTicketRequets,
  changeTicketReqStatuss,
} from "@/lib/api/events";
import { StatusBadge } from "@/components/status-badge";
import { TicketRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
// import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";

export default function EventTicketRequests() {
  const queryClient = useQueryClient();
  const params = useParams();
  const eventId = params.id as string;
  const { toast } = useToast();

  const { data: ticketRequests } = useQuery({
    queryKey: ["event", eventId, "tickets"],
    queryFn: () => getTicketRequets(eventId),
  });

  const { data: event, isFetched: eventFetched } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    select(data) {
      return data.event;
    },
  });

  const { mutate: changeTicketStatus } = useMutation({
    mutationFn: async ({
      ticketId,
      newStatus,
      userId,
    }: {
      ticketId: string;
      newStatus: "APPROVED" | "DECLINED";
      userId: string;
    }) => await changeTicketReqStatuss(ticketId, newStatus, userId),
    onMutate(variables) {
      queryClient.cancelQueries({ queryKey: ["event", eventId, "tickets"] });
      const previousTickets = queryClient.getQueryData([
        "event",
        eventId,
        "tickets",
      ]);
      queryClient.setQueryData(
        ["event", eventId, "tickets"],
        (old: TicketRequest[]) => {
          return old.map((ticket) => {
            if (ticket.id === variables.ticketId) {
              return {
                ...ticket,
                status: variables.newStatus,
              };
            }
            return ticket;
          });
        }
      );

      return { previousTickets };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ticket request status changed successfully",
      });
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["event", eventId, "tickets"],
        context?.previousTickets
      );
    },
  });

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container mx-auto py-8 px-4">
      {eventFetched && (
        <>
          <h1 className="text-2xl font-bold mb-2">{event!.title}</h1>
          <p className="text-muted-foreground mb-4">
            Date: {new Date(event!.date).toISOString().split("T")[0]} |
            Location: {event!.location}
          </p>
        </>
      )}
      <h2 className="text-xl font-semibold mb-4">Ticket Requests</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by purchaser name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Purchaser ID</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ticketRequests ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No Ticket Requests found.
                </TableCell>
              </TableRow>
            ) : (
              ticketRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell className="font-medium flex items-center space-x-2">
                    {req.userId}
                    <ArrowUpRightFromCircleIcon className="size-4" />
                  </TableCell>
                  <TableCell>{req.meta.ticketType}</TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      className="text-white bg-green-700 rounded-full hover:bg-green-800"
                      size="sm"
                      disabled={
                        req.status === "APPROVED" || req.status === "DECLINED"
                      }
                      onClick={() =>
                        changeTicketStatus({
                          ticketId: req.id,
                          newStatus: "APPROVED",
                          userId: req.userId,
                        })
                      }
                    >
                      <Check className="mr-2 size-4" />
                      Approve
                    </Button>
                    <Button
                      className="text-white bg-red-700 rounded-full hover:bg-red-800"
                      size="sm"
                      disabled={
                        req.status === "APPROVED" || req.status === "DECLINED"
                      }
                      onClick={() =>
                        changeTicketStatus({
                          ticketId: req.id,
                          newStatus: "DECLINED",
                          userId: req.userId,
                        })
                      }
                    >
                      <X className="mr-2 size-4" />
                      Decline
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
