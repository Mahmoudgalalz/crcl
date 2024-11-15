import { DollarSign, Calendar, Ticket, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function Cards({
  data,
}: {
  data: {
    totalMoney: {
      combinedTotal: number;
      walletTotal: number;
      paymentTotal: number;
    };
    eventStats: {
      totalEvents: number;
      upcomingEvents: number;
      pastEvents: number;
    };
    totalPaidTickets: number;
    boothTransactions: {
      _sum: {
        amount: number;
      };
      _count: {
        id: number;
      };
    }[];
  };
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Money</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.totalMoney?.combinedTotal || 0}
            <span className="text-sm ml-0.5">EGP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Wallet: {data?.totalMoney?.walletTotal || 0}
            <span className="text-xs ml-0.5">EGP</span> | Payment:
            {data?.totalMoney?.paymentTotal || 0}
            <span className="text-xs ml-0.5">EGP</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.eventStats?.totalEvents || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Upcoming: {data?.eventStats?.upcomingEvents || 0} | Past:{" "}
            {data?.eventStats?.pastEvents || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Paid Tickets
          </CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.totalPaidTickets || 0}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Booth Transactions
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.boothTransactions[0]?._sum?.amount || 0}
            <span className="text-sm ml-1">EGP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Count: {data?.boothTransactions[0]?._count?.id || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
