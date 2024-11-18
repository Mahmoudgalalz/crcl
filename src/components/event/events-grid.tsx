import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { EventItem } from "./event-item";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEvents } from "@/hooks/use-events";

export function EventsGrid() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const {
    page,
    searchQuery,
    setPage,
    setSearchQuery,
    eventsData: events,
  } = useEvents();

  const filteredEvents = useMemo(() => {
    return events?.events
      .filter((event) =>
        statusFilter === "ALL" ? true : event.status === statusFilter
      )
      .sort((a, b) => {
        const statusOrder = [
          "DRAFTED",
          "PUBLISHED",
          "ENDED",
          "CANCLED",
          "DELETED",
        ];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });
  }, [events, statusFilter]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="lg:w-[200px] sm:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFTED">Drafted</option>
            <option value="PUBLISHED">Published</option>
            <option value="ENDED">Ended</option>
            <option value="CANCLED">Cancelled</option>
            <option value="DELETED">Deleted</option>
          </select>
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents?.map((event) => (
          <EventItem event={event} key={event.id} />
        ))}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page + 1)}
              className={
                page === Math.ceil(events?.total / 6)
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
