import { Analytics, BoothAnalytics } from "@/lib/types";
import { BoothTransChart } from "./booth-trans-chart";
import { EventDistributionChart } from "./event-distro-chart";
import { EventReqsCountChart } from "./event-reqs-counts";
import { MoneyDistributionChart } from "./money-distro-chart";
import { RevenueByEventChart } from "./revenue-by-event";

export function Charts({
  moneyDistribution,
  eventDistribution,
  eventRequestCounts,
  boothTransactions,
  revenueByEvent,
  date,
}: {
  moneyDistribution: {
    name: string;
    value: number;
  }[];
  eventDistribution: {
    name: string;
    value: number;
  }[];
  eventRequestCounts: {
    eventId: string;
    eventTitle: string;
    requestCount: number;
  }[];
  boothTransactions: BoothAnalytics;
  revenueByEvent: Analytics["userRequestCounts"];
  date: {
    from: Date;
    to: Date;
  };
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <BoothTransChart chartData={boothTransactions} />
        <EventReqsCountChart chartData={eventRequestCounts} />
        <RevenueByEventChart chartData={revenueByEvent} date={date} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <MoneyDistributionChart chartData={moneyDistribution} />
        <EventDistributionChart chartData={eventDistribution} />
      </div>
    </>
  );
}
