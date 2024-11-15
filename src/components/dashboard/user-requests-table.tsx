"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

type UserRequest = {
  id: string;
  title: string;
  location: string;
  date: string;
  totalRevenue: number;
  totalPaidTickets: number;
  totalUnpaidTickets: number;
  totalPendingTickets: number;
  totalRequests: number;
};

const columns: ColumnDef<UserRequest>[] = [
  {
    accessorKey: "title",
    header: "Event Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("date")).toISOString().split("T")[0],
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
    cell: ({ row }) => `${row.getValue("totalRevenue")} EGP`,
  },
  {
    accessorKey: "totalPaidTickets",
    header: "Paid Tickets",
  },
  {
    accessorKey: "totalUnpaidTickets",
    header: "Unpaid Tickets",
  },
  {
    accessorKey: "totalPendingTickets",
    header: "Pending Tickets",
  },
  {
    accessorKey: "totalRequests",
    header: "Total Requests",
  },
];

export function UsersRequestsTable({
  userRequestCounts,
  date,
}: {
  userRequestCounts: UserRequest[] | undefined;
  date: {
    from: Date;
    to: Date;
  };
}) {
  const table = useReactTable({
    data: userRequestCounts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Events Overview</CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            In the period from {date.from.toISOString().split("T")[0]} to{" "}
            {date.to.toISOString().split("T")[0]}
          </CardDescription>
        </div>

        <Users className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
