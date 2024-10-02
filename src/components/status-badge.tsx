import React from "react";
import { Badge } from "@/components/ui/badge";
import { EventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "PUBLISHED" ? "bg-green-500 text-emerald-50" : "",

        status === "DRAFTED" ? "bg-yellow-500 text-yellow-50" : "",
        "tracking-wider text-xs font-light"
      )}
    >
      {status}
    </Badge>
  );
}
