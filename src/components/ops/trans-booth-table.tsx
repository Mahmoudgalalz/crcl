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
import { flexRender, CellContext } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction, User } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useBoothTransactionsTable } from "@/hooks/use-trans-booth-table";
import { useState } from "react";

type TransactionsTableProps = {
  boothData: User;
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
  boothData,
}: TransactionsTableProps) {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const {
    table,
    columns,
    handleWithdraw,
    setWithdrawAmount,
    withdrawAmount,
    isWithdrawLoading,
  } = useBoothTransactionsTable({
    totalPages,
    transactions,
    id: boothData.id,
  });
  console.log("transactions");
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
                        {/**@ts-ignore */}
                        {flexRender(column.cell, {
                          getValue: () =>
                            transaction[
                              column.accessorKey as keyof Transaction
                            ],
                          row: { original: transaction },
                        } as CellContext<Transaction, string>)}
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
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + "page"}>
                  <PaginationLink
                    onClick={() => onPageChange(i + 1)}
                    isActive={currentPage === i + 1}
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
      <CardFooter>
        <div className="flex justify-end w-full">
          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button>Withdraw Money</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Money</DialogTitle>
                <DialogDescription>
                  Withdraw money for the booth with the name: {boothData.name}{" "}
                  and id: {boothData.id} .
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount ?? 0}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                />
                <Button
                  onClick={() => {
                    handleWithdraw();
                    setIsWithdrawOpen(false);
                  }}
                  disabled={!withdrawAmount || isWithdrawLoading}
                >
                  {isWithdrawLoading ? "Withdrawing..." : "Withdraw"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
