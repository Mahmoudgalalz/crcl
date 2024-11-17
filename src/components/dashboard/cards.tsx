import { DollarSign, Calendar, Ticket, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Analytics, BoothAnalytics } from "@/lib/types";

export function Cards({
  data,
  date,
  boothData,
}: {
  data: Analytics;
  date: {
    from: Date;
    to: Date;
  };
  boothData: BoothAnalytics;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Events Total Revenue
          </CardTitle>
          <DollarSign className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.userRequestCounts.combinedRevenue || 0}
            <span className="text-sm ml-0.5">EGP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            In the period from {date.from.toISOString().split("T")[0]} to{" "}
            {date.to.toISOString().split("T")[0]}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Total Events</CardTitle>
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.userRequestCounts.totalEvents || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            In the period from {date.from.toISOString().split("T")[0]} to{" "}
            {date.to.toISOString().split("T")[0]}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Total Paid Tickets
          </CardTitle>
          <Ticket className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.userRequestCounts.totalPaidTickets || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            In the period from {date.from.toISOString().split("T")[0]} to{" "}
            {date.to.toISOString().split("T")[0]}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Booth Transactions
          </CardTitle>
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {boothData
              .map((booth) => booth._sum?.amount || 0)
              .reduce((a, b) => a + b, 0)}
            <span className="text-sm ml-1">EGP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Count: {boothData.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
