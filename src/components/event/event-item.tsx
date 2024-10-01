import { CalendarIcon, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnEvent } from "@/lib/types";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function EventItem({ event }: { event: AnEvent }) {
  return (
    <Link href={`/events/${event.id}`} key={event.id}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader>
          <Image
            src={"https://placehold.co/600x400/EEE/31343C"}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-40 object-cover mb-4 rounded"
          />
          <CardTitle className="flex items-center justify-between">
            <h2>{event.title}</h2>
            <Badge
              variant="outline"
              className={cn(
                event.status === "PUBLISHED"
                  ? "bg-green-500 text-emerald-50"
                  : "",

                event.status === "DRAFTED" ? "bg-yellow-500" : ""
              )}
            >
              {event.status}
            </Badge>
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
            {event.capacity} Person
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Click to view ticket requests
        </CardFooter>
      </Card>
    </Link>
  );
}
