"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
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
  } = useTicketReqs(eventId);

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
                <SelectItem value="BOOKED">Booked</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
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
          <Pagination className="mt-4">
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
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => table.setPageIndex(i)}
                    isActive={table.getState().pagination.pageIndex === i}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
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
        </div>
      </div>
    </ContentLayout>
  );
}
