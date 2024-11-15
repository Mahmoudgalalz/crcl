import { BoothAnalytics } from "@/lib/types";
import { BoothTransChart } from "./booth-trans-chart";
import { EventDistributionChart } from "./event-distro-chart";
import { EventReqsCountChart } from "./event-reqs-counts";
import { MoneyDistributionChart } from "./money-distro-chart";

export function Charts({
  moneyDistribution,
  eventDistribution,
  eventRequestCounts,
  boothTransactions,
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
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
        <MoneyDistributionChart chartData={moneyDistribution} />

        <EventDistributionChart chartData={eventDistribution} />
        <EventReqsCountChart chartData={eventRequestCounts} />

        <BoothTransChart chartData={boothTransactions} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mb-6"></div>
    </>
  );
}
