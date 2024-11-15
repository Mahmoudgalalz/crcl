import { BoothTransChart } from "./booth-trans-chart";
import { EventDistributionChart } from "./event-distro-chart";
import { EventReqsCountChart } from "./event-reqs-counts";
import { MoneyDistributionChart } from "./money-distro-chart";
import { TotalRevenue } from "./total-revenue";

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
    _count: {
      id: number;
    };
    eventId: string;
  }[];
  boothTransactions: {
    _sum: {
      amount: number;
    };
    _count: {
      id: number;
    };
    to: string;
  }[];
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <TotalRevenue />

        <MoneyDistributionChart chartData={moneyDistribution} />

        <EventDistributionChart chartData={eventDistribution} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <EventReqsCountChart chartData={eventRequestCounts} />

        <BoothTransChart chartData={boothTransactions} />
      </div>
    </>
  );
}
