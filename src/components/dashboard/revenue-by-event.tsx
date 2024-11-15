"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Analytics } from "@/lib/types";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";

const chartConfig = {
  eventId: {
    label: "Event",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueByEventChart({
  chartData,
  date,
}: {
  chartData: Analytics["userRequestCounts"];
  date: {
    from: Date;
    to: Date;
  };
}) {
  const transformedData = chartData.eventDetails
    .sort((a, b) => a.totalRevenue - b.totalRevenue)
    .map((data) => ({
      eventId: data.title,
      count: data.totalRevenue,
    }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Revenue By Event</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            In the period from {date.from.toISOString().split("T")[0]} to{" "}
            {date.to.toISOString().split("T")[0]}
          </CardDescription>
        </div>
        <DollarSign className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent className="mt-2">
        <ChartContainer config={chartConfig}>
          {transformedData.length > 0 ? (
            <BarChart
              accessibilityLayer
              data={transformedData}
              margin={{
                top: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="eventId"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                label="Event"
                content={<ChartTooltipContent />}
                formatter={(value) => value + " EGP"}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          ) : (
            <div>No data available</div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
