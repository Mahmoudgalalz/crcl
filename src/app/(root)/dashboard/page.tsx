"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/dashboard";
import { ContentLayout } from "@/components/content-layout";
import {
  DollarSign,
  Calendar,
  Ticket,
  ShoppingBag,
  Users,
  BarChartIcon,
} from "lucide-react";
import { EventDistributionChart } from "@/components/dashboard/event-distro-chart";
import { MoneyDistributionChart } from "@/components/dashboard/money-distro-chart";
import { EventReqsCountChart } from "@/components/dashboard/event-reqs-counts";
import { BoothTransChart } from "@/components/dashboard/booth-trans-chart";
import { UsersRequestsTable } from "@/components/dashboard/user-requests-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { TotalRevenue } from "@/components/dashboard/total-revenue";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: () => getAnalytics(dateRange.from, dateRange.to),
  });

  const moneyDistribution = [
    { name: "Wallet", value: data?.totalMoney?.walletTotal || 0 },
    { name: "Payment", value: data?.totalMoney?.paymentTotal || 0 },
  ];

  const eventDistribution = [
    { name: "Upcoming", value: data?.eventStats?.upcomingEvents || 0 },
    { name: "Past", value: data?.eventStats?.pastEvents || 0 },
  ];

  return (
    <ContentLayout title="Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Money
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Total Events
                </CardTitle>
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <TotalRevenue />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Money Distribution</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <MoneyDistributionChart chartData={moneyDistribution} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Event Distribution</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <EventDistributionChart chartData={eventDistribution} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Event Requests Count</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="mt-2">
                <EventReqsCountChart
                  chartData={data?.eventRequestCounts ?? []}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Booth Transactions</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <BoothTransChart chartData={data?.boothTransactions ?? []} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>User Requests Count</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <UsersRequestsTable
                userRequestCounts={data?.userRequestCounts ?? []}
              />
            </CardContent>
          </Card>
        </>
      )}
    </ContentLayout>
  );
}
