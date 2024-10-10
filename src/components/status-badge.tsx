import React from "react";
import { Badge } from "@/components/ui/badge";
import { EventStatus, NewsStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: EventStatus | NewsStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "PUBLISHED" ? "bg-green-500 text-emerald-50" : "",

        status === "DRAFTED" ? "bg-yellow-500 text-yellow-50" : "",
        status === "DELETED" ? "bg-red-500 text-red-50" : "",

        "tracking-wider text-xs font-light mt-1"
      )}
    >
      {status}
    </Badge>
  );
}
