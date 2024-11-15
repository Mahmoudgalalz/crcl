"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/dashboard";
import { ContentLayout } from "@/components/content-layout";
import { UsersRequestsTable } from "@/components/dashboard/user-requests-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cards } from "@/components/dashboard/cards";
import { Charts } from "@/components/dashboard/charts";

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
      <div className="flex justify-between items-center h-[10dvh] max-h-[15dvh] border-b-2 -mt-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <ScrollArea className="h-[80dvh]">
          <Cards data={data} />

          <Charts
            eventDistribution={eventDistribution}
            moneyDistribution={moneyDistribution}
            eventRequestCounts={data?.eventRequestCounts ?? []}
            boothTransactions={data?.boothTransactions ?? []}
          />

          <UsersRequestsTable
            userRequestCounts={data?.userRequestCounts ?? []}
          />
        </ScrollArea>
      )}
    </ContentLayout>
  );
}
