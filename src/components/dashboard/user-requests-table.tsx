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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        period: string;
        data: UserRequest[];
      }[]
    | undefined;
}) {
  const defaultTab = userRequestCounts?.[0]?.period || "1_week";
  const [activeTab, setActiveTab] = React.useState<string>(defaultTab);

  const table = useReactTable({
    data:
      userRequestCounts?.find((item) => item.period === activeTab)?.data || [],
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
    <Tabs defaultValue={defaultTab} onValueChange={setActiveTab}>
      <TabsList>
        {userRequestCounts?.map(({ period }) => (
          <TabsTrigger key={period} value={period}>
            {period.replace("_", " ")}
          </TabsTrigger>
        )) ?? []}
      </TabsList>
      {userRequestCounts?.map(({ period }) => (
        <TabsContent key={period} value={period}>
          <div className="rounded-md border">
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
          </div>
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
        </TabsContent>
      )) ?? []}
    </Tabs>
  );
}
