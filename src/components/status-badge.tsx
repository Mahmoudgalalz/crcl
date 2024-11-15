import React from "react";
import { Badge } from "@/components/ui/badge";
import type {
  EventStatus,
  NewsStatus,
  PaymentStatus,
  TicketStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
}: {
  status: EventStatus | NewsStatus | TicketStatus | PaymentStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "PUBLISHED" || status === "APPROVED" || status === "PAID"
          ? "bg-emerald-500 text-emerald-50"
          : "",
        status === "DRAFTED" ? "bg-yellow-500 text-yellow-50" : "",
        status === "DELETED" || status === "DECLINED"
          ? "bg-red-500 text-red-50"
          : "",
        status === "PAST_DUE" ? "bg-red-500 text-red-50" : "",
        status === "BOOKED" ? "bg-blue-500 text-blue-50" : "",

        "tracking-wider text-xs font-light mt-1"
      )}
    >
      {status}
    </Badge>
  );
}
