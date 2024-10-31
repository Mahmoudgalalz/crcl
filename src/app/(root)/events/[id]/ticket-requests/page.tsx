"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, X, ArrowLeft, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEvent,
  getTicketRequets,
  changeTicketReqStatuss,
} from "@/lib/api/events";
import { StatusBadge } from "@/components/status-badge";
import { TicketRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { ContentLayout } from "@/components/content-layout";

export default function EventTicketRequests() {
  const queryClient = useQueryClient();
  const params = useParams();
  const eventId = params.id as string;
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

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

  const router = useRouter();

  const filteredTicketRequests =
    ticketRequests?.filter((req) =>
      statusFilter === "ALL" ? true : req.status === statusFilter
    ) || [];

  return (
    <ContentLayout title={`${event?.title}'s Ticket Requests`}>
      <div className="container mx-auto">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to the event
        </Button>
        {eventFetched && (
          <>
            <h1 className="text-2xl font-bold mb-2">{event!.title}</h1>
            <p className="text-muted-foreground mb-4">
              Date: {new Date(event!.date).toISOString().split("T")[0]} |
              Location: {event!.location}
            </p>
          </>
        )}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tickets Requests</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="DECLINED">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchaser ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredTicketRequests.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No Ticket Requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTicketRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.userId}</TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(req.updateAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="space-x-2">
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
                              <StatusBadge status={req.status} />
                            </div>
                            <div>
                              Number of requested tickets: {req.meta.length}
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
                              {req.meta?.map((reqUser, idx) => (
                                <TableRow
                                  key={`ReqUser` + idx + `for` + req.id}
                                >
                                  <TableCell>{reqUser.name}</TableCell>
                                  <TableCell>{reqUser.email}</TableCell>
                                  <TableCell>{reqUser.number}</TableCell>
                                  <TableCell>{reqUser.social}</TableCell>
                                  <TableCell>
                                    {
                                      event?.tickets.find(
                                        (ticketType) =>
                                          ticketType.id === reqUser.ticketId
                                      )?.title
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {
                                      event?.tickets.find(
                                        (ticketType) =>
                                          ticketType.id === reqUser.ticketId
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
                              disabled={req.status === "APPROVED"}
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
                              disabled={req.status === "DECLINED"}
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
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </ContentLayout>
  );
}
