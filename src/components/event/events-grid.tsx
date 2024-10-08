"use client";
import React from "react";
import { AnEvent } from "@/lib/types";
import { EventItem } from "./event-item";

export function EventsGrid({ events }: { events?: AnEvent[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events
          ?.sort((a, b) => {
            const statusOrder = [
              "DRAFTED",
              "PUBLISHED",
              "ENDED",
              "CANCLED",
              "DELETED",
            ];
            return (
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
            );
          })
          .map((event) => (
            <EventItem event={event} key={event.id} />
          ))}
      </div>
    </div>
  );
}
