import {
  getTicketRequets,
  getEvent,
  changeTicketReqStatuss,
} from "@/lib/api/events";
import { TicketRequest, TicketStatus } from "@/lib/types";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { StatusBadge } from "@/components/status-badge";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { TicketReqDetails } from "@/components/event/ticket-reqs/ticket-req-details";
import { debounce } from "@/lib/utils";

const columnHelper = createColumnHelper();

export function useTicketReqs(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  const { data: ticketRequests } = useQuery({
    queryKey: ["event", eventId, "tickets", page, debouncedSearchTerm],
    queryFn: () => getTicketRequets(eventId, page, debouncedSearchTerm),
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

  const filteredTicketRequests =
    ticketRequests?.data.filter((req) =>
      statusFilter === "ALL" ? true : req.status === statusFilter
    ) || [];

  const columns = [
    columnHelper.accessor("userId", {
      header: "Purchaser ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    }),
    columnHelper.accessor("updateAt", {
      header: "Last Updated At",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <StatusBadge status={info.getValue() as TicketStatus} />,
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info) => (
        <TicketReqDetails
          changeTicketStatus={changeTicketStatus}
          event={event}
          info={info}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredTicketRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredTicketRequests.length / 10),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize: 10 });
        setPage(newState.pageIndex + 1);
      }
    },
    manualPagination: true,
  });

  return {
    ticketRequests: filteredTicketRequests,
    statusFilter,
    setStatusFilter,
    event,
    eventFetched,
    changeTicketStatus,
    page,
    setPage,
    table,
    columns,
    searchTerm,
    setSearchTerm,
  };
}