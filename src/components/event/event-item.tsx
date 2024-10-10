import { CalendarIcon, Users } from "lucide-react";
import { Link } from "next-view-transitions";

import React from "react";
import { AnEvent } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { StatusBadge } from "../status-badge";

export function EventItem({ event }: { event: AnEvent }) {
  console.log(event);

  const image =
    process.env.NODE_ENV === "production"
      ? event.image
      : event.image?.replace("https", "http");

  return (
    <Link href={`/events/${event.id}`} key={event.id}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader>
          <img
            src={image}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-40 object-cover mb-4 rounded"
          />
          <CardTitle className="flex items-center justify-between">
            <h2>{event.title}</h2>
            <StatusBadge status={event.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="h-4">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {event.capacity} Capacity
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Click to view ticket requests
        </CardFooter>
      </Card>
    </Link>
  );
}
