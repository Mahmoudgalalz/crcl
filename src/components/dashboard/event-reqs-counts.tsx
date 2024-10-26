"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Analytics } from "@/lib/types";

const chartConfig = {
  eventId: {
    label: "Event",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function EventReqsCountChart({
  chartData,
}: {
  chartData: Analytics["eventRequestCounts"];
}) {
  const transformedData = chartData.map((data) => ({
    eventId: data.eventId,
    count: data._count.id,
  }));

  return (
    <ChartContainer config={chartConfig}>
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
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
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
    </ChartContainer>
  );
}
