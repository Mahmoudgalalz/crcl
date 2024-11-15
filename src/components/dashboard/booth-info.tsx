import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, BarChartIcon } from "lucide-react";
import { BoothTransChart } from "@/components/dashboard/booth-trans-chart";

interface BoothInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boothTransactions: any[]; // Replace 'any' with the actual type of boothTransactions
}

export function BoothInfo({ boothTransactions }: BoothInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Booth Transactions
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {boothTransactions[0]?._sum?.amount || 0}
            <span className="text-sm ml-1">EGP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Count: {boothTransactions[0]?._count?.id || 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Booth Transactions</CardTitle>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <BoothTransChart chartData={boothTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
