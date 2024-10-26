/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  CellContext,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type TransactionsTableProps = {
  transactions: Transaction[];
  tokenPrice: number | null;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
};

export function TransactionsTable({
  transactions,
  tokenPrice,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
}: TransactionsTableProps) {
  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => format(new Date(info.getValue()), "PPp"),
    }),
    columnHelper.accessor("from", {
      header: "From",
      cell: (info) => (
        <span className="font-medium">
          {info.getValue().split("@")[0]}@
          <span className="text-zinc-500">{info.getValue().split("@")[1]}</span>
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge variant={info.getValue() === "PAID" ? "default" : "secondary"}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="font-medium">
          {info.getValue()} <span className="text-zinc-500 text-xs">EGP</span>
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction History</span>
          <Badge variant="outline" className="ml-2">
            Token Price: {tokenPrice}
            <span className="text-zinc-500 text-xs px-0.5">EGP</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {flexRender(column.cell, {
                          getValue: () =>
                            transaction[
                              column.accessorKey as keyof Transaction
                            ],
                          row: { original: transaction },
                        } as CellContext<Transaction, string | number>)}
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
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className={
                    currentPage === 0 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => onPageChange(i)}
                    isActive={currentPage === i}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
