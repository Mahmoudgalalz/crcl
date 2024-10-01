"use client";
import React from "react";
import { AnEvent } from "@/lib/types";
import { EventItem } from "./event-item";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api/events";

export function EventsGrid({
  events,
}: {
  events: {
    events: AnEvent[];
    total: number;
  };
}) {
  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    initialData: events,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventsData.events.map((event) => (
          <EventItem event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}
