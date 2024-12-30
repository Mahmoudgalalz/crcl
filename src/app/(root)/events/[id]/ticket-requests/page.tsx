"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, Download } from "lucide-react";
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
import { ContentLayout } from "@/components/content-layout";
import { useTicketReqs } from "@/hooks/use-ticket-reqs";
import { flexRender } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { SendInvitationModal } from "@/components/event/ticket-reqs/send-invitaion-modal";
import { axiosInstance } from "@/lib/api/instance";

export default function EventTicketRequests() {
  const params = useParams();
  const eventId = params.id as string;
  const router = useRouter();

  const {
    event,
    eventFetched,
    setStatusFilter,
    statusFilter,
    table,
    searchTerm,
    setSearchTerm,
    numberOfRequests,
    numberOfInvites,
  } = useTicketReqs(eventId);

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(`/events/export/${eventId}`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `ticket-requests-${eventId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const renderPagination = () => {
    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;
    const maxPageNumbers = 5;
    const startPage = Math.max(0, pageIndex - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(pageCount - 1, startPage + maxPageNumbers - 1);

    const pages = [];

    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < pageCount - 1) {
      if (endPage < pageCount - 2) pages.push("...");
      pages.push(pageCount - 1);
    }

    return pages.map((page, index) => (
      <PaginationItem key={index}>
        {typeof page === "number" ? (
          <PaginationLink
            onClick={() => table.setPageIndex(page)}
            isActive={table.getState().pagination.pageIndex === page}
          >
            {page + 1}
          </PaginationLink>
        ) : (
          <span className="px-2">...</span>
        )}
      </PaginationItem>
    ));
  };

  return (
    <ContentLayout title="Event Ticket Requests">
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
              Location: {event!.location} | Total Requests: {numberOfRequests} |
              Total Invitations: {numberOfInvites}
            </p>
          </>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 items-end justify-end">
            <h2 className="text-xl font-semibold">Tickets Requests</h2>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
            <SendInvitationModal
              eventId={eventId}
              ticketTypes={
                event?.tickets.map((ticket) => ({
                  id: ticket.id,
                  name: ticket.title,
                })) || []
              }
            />
          </div>
        </div>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-6 w-6" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
