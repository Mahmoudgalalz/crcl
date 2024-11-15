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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";

type UserRequest = {
  userId: string;
  eventId: string;
  eventName: string;
  requestCount: number;
};

const columns: ColumnDef<UserRequest>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "eventId",
    header: "Event ID",
  },
  {
    accessorKey: "eventName",
    header: "Event Name",
  },
  {
    accessorKey: "requestCount",
    header: "Request Count",
  },
];

export function UsersRequestsTable({
  userRequestCounts,
}: {
  userRequestCounts:
    | {
        id: string;
        title: string;
        location: string;
        date: string;
        totalRevenue: number;
        totalPaidTickets: number;
        totalUnpaidTickets: number;
        totalPendingTickets: number;
        totalRequests: number;
      }[]
    | undefined;
}) {
  const table = useReactTable({
    data:
      userRequestCounts
        ?.map(({ totalRequests, id, title, location }) => ({
          userId: id,
          eventId: title,
          eventName: location,
          requestCount: totalRequests,
        }))
        .flat() || [],
    columns: columns.map((column) => ({
      ...column,
      accessorFn: (row) => row[column.id as keyof UserRequest],
    })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>User Requests Count</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
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
    </>
  );
}
