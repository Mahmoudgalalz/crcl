"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/dashboard";
import { ContentLayout } from "@/components/content-layout";
import {
  DollarSign,
  Calendar,
  Ticket,
  ShoppingBag,
  Users,
  BarChart as BarChartIcon,
} from "lucide-react";
import { EventDistribution } from "@/components/dashboard/event-distro";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
// } from "@/components/ui/chart";
// import {  } from "@/components/ui/chart";

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  // const moneyDistribution = [
  //   { name: "Wallet", value: data?.totalMoney?.walletTotal || 0 },
  //   { name: "Payment", value: data?.totalMoney?.paymentTotal || 0 },
  // ];

  const eventDistribution = [
    { name: "Upcoming", value: data?.eventStats?.upcomingEvents || 0 },
    { name: "Past", value: data?.eventStats?.pastEvents || 0 },
  ];

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Money</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data?.totalMoney?.combinedTotal || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Wallet: ${data?.totalMoney?.walletTotal || 0} | Payment: $
              {data?.totalMoney?.paymentTotal || 0}
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
              ${data?.boothTransactions[0]?._sum?.amount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Count: {data?.boothTransactions[0]?._count?.id || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Event Request Counts</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.eventRequestCounts ?? []}>
                <XAxis dataKey="eventId" />
                <YAxis />
                <Bar dataKey="_count.id" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Booth Transactions</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.boothTransactions ?? []}>
                <XAxis dataKey="to" />
                <YAxis />
                <Bar dataKey="_sum.amount" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Money Distribution</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moneyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moneyDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Event Distribution</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer> */}
            <EventDistribution chartData={eventDistribution} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>User Request Counts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1_week">
            <TabsList>
              {data?.userRequestCounts?.map(({ period }) => (
                <TabsTrigger key={period} value={period}>
                  {period.replace("_", " ")}
                </TabsTrigger>
              )) ?? []}
            </TabsList>
            {data?.userRequestCounts?.map(({ period, data }) => (
              <TabsContent key={period} value={period}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Request Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.userId}</TableCell>
                        <TableCell>{item.eventId}</TableCell>
                        <TableCell>{item.eventName}</TableCell>
                        <TableCell>{item.requestCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            )) ?? []}
          </Tabs>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
