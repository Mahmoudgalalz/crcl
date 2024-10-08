import { CalendarIcon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnEvent } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { StatusBadge } from "../status-badge";

export function EventItem({ event }: { event: AnEvent }) {
  const image = event.image?.includes("https://127.0.0.1")
    ? event.image.replace("https://", "http://")
    : "/placeholder.jpg";
  return (
    <Link href={`/events/${event.id}`} key={event.id}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader>
          <Image
            src={image ?? "https://placehold.co/600x400/EEE/31343C"}
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
