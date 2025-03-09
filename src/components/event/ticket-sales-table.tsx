import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, TicketAggregates } from "@/lib/types";

interface TicketSalesTableProps {
  tickets: Ticket[];
  ticketsAggregate: TicketAggregates[];
}

export function TicketSalesTable({
  ticketsAggregate,
}: TicketSalesTableProps) {

  const totalRevenue = ticketsAggregate.reduce((acc, agg) => {
    return acc + ((agg.paymentStatusCounts?.PAID || 0) * agg.ticket.price);
  }, 0);

  const totalSold = ticketsAggregate.reduce(
    (acc, agg) => acc + (agg.paymentStatusCounts?.PAID || 0),
    0
  );

  const totalPending = ticketsAggregate.reduce(
    (acc, agg) => acc + (agg.paymentStatusCounts?.PENDING || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Ticket Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-slate-50">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} EGP</p>
          </Card>
          <Card className="p-4 bg-slate-50">
            <p className="text-sm text-muted-foreground">Tickets Sold</p>
            <p className="text-2xl font-bold">{totalSold.toLocaleString()}</p>
          </Card>
          <Card className="p-4 bg-slate-50">
            <p className="text-sm text-muted-foreground">Pending Payments</p>
            <p className="text-2xl font-bold">{totalPending.toLocaleString()}</p>
          </Card>
        </div>

        <Table>
          <TableHeader className="bg-slate-900/20">
            <TableRow>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketsAggregate.map((agg) => {
              const ticket = agg.ticket;
              const sales = {
                paid: agg.paymentStatusCounts?.PAID || 0,
                pending: agg.paymentStatusCounts?.PENDING || 0,
                total: (agg.paymentStatusCounts?.PAID || 0) + (agg.paymentStatusCounts?.PENDING || 0)
              };
              const available = ticket.capacity - sales.total;
              const revenue = sales.paid * ticket.price;
              const isDeleted = ticket.deletedAt !== null;
              
              return (
                <TableRow 
                  key={ticket.id}
                  className={isDeleted ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>{ticket.price} EGP</TableCell>
                  <TableCell>{ticket.capacity}</TableCell>
                  <TableCell>{sales.paid}</TableCell>
                  <TableCell>{sales.pending}</TableCell>
                  <TableCell>{available}</TableCell>
                  <TableCell>
                    {isDeleted ? (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Deleted</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{revenue.toLocaleString()} EGP</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
