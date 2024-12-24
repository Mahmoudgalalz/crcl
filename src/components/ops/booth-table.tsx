"use client";

import { useCallback, useMemo, useState } from "react";
import { useBooths } from "@/hooks/use-booths";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CreateOpsUserForm } from "./create-ops-user-form";
import { debounce } from "@/lib/utils";
import { TransactionsTable } from "./trans-booth-table";
import { useBoothTransactions } from "@/hooks/use-booth-trans";
import type { User } from "@/lib/types";
import {
  User as UserIcon,
  Wallet,
  Phone,
  Mail,
  CreditCard,
  BarChart,
} from "lucide-react";

export function BoothTable() {
  const { booths, columns, useTable, addBooth, ROWS_PER_PAGE } = useBooths();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<User | null>(null);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: transactionsData, isLoading } = useBoothTransactions(
    selectedBooth?.id ?? null,
    currentPage
  );

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((...args: unknown[]) => setSearchQuery(args[0] as string), 300),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetSearchQuery(e.target.value);
    },
    [debouncedSetSearchQuery]
  );

  const handleRowClick = (booth: User) => {
    setSelectedBooth(booth);
    setIsTransactionsOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData = useMemo(() => {
    return (
      booths?.booths.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? []
    );
  }, [booths, searchQuery]);

  const memoizedTable = useTable(filteredData);
  const currentPageData = memoizedTable.getRowModel().rows;

  console.log(transactionsData?.boothTransactions.currentPage);
  return (
    <div className="space-y-4 min-w-full">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search booths..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <CreateOpsUserForm addUser={addBooth} />
      </div>

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {memoizedTable.getHeaderGroups().map((headerGroup) => (
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
            {currentPageData.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {currentPageData.length < ROWS_PER_PAGE &&
              Array(ROWS_PER_PAGE - currentPageData.length)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    {columns.map((column, columnIndex) => (
                      <TableCell
                        key={`empty-${index}-${columnIndex}`}
                        className="p-4"
                      >
                        &nbsp;
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Transactions for {selectedBooth?.name}</DialogTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-primary mt-2" />
                  <span>ID</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {selectedBooth?.id}
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-primary mt-2" />
                  <span>Name</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {selectedBooth?.name}
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary mt-2" />
                  <span>Email</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {selectedBooth?.email}
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary mt-2" />
                  <span>Phone</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {selectedBooth?.number}
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <Wallet className="h-4 w-4 text-primary mt-2" />
                  <span>Wallet</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {
                    booths?.booths.find(
                      (booth) => booth.id === selectedBooth?.id
                    )?.wallet?.balance
                  }
                  <span className="text-muted-foreground text-xs px-0.5">
                    EGP
                  </span>
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <BarChart className="h-4 w-4 text-primary mt-2" />
                  <span>Transactions</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {transactionsData?.boothTransactions.transactions.length}
                  <span className="text-muted-foreground text-xs">
                    Transactions
                  </span>
                </CardContent>
              </Card>
              <Card className="*:!p-3">
                <CardHeader className="!p-2 flex flex-row items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-primary mt-2" />
                  <span>Total Amount</span>
                </CardHeader>
                <CardContent className="text-sm font-medium">
                  {transactionsData?.boothTransactions.transactions.reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  )}
                  <span className="text-muted-foreground text-xs px-0.5">
                    EGP
                  </span>
                </CardContent>
              </Card>
            </div>
          </DialogHeader>
          <TransactionsTable
            boothData={selectedBooth!}
            transactions={
              transactionsData?.boothTransactions.transactions ?? []
            }
            tokenPrice={transactionsData?.tokenPrice.tokenPrice ?? null}
            totalPages={transactionsData?.boothTransactions.totalPages ?? 0}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => memoizedTable.previousPage()}
              className={
                !memoizedTable.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
          {Array.from({ length: memoizedTable.getPageCount() }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => memoizedTable.setPageIndex(i)}
                isActive={memoizedTable.getState().pagination.pageIndex === i}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => memoizedTable.nextPage()}
              className={
                !memoizedTable.getCanNextPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
