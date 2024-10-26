"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  booth: {
    label: "Booth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BoothTransChart({
  chartData,
}: {
  chartData: {
    _sum: {
      amount: number;
    };
    _count: {
      id: number;
    };
    to: string;
  }[];
}) {
  const transformedData = chartData.map((data) => ({
    booth: data.to,
    count: data._count.id,
    amount: data._sum.amount,
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
          dataKey="booth"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 10)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={8}>
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
