"use client";

import { useCallback, useMemo, useState } from "react";
import { useReaders } from "@/hooks/use-readers";
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
import { CreateOpsUserForm } from "./create-ops-user-form";
import { debounce } from "@/lib/utils";

export default function ReaderTable() {
  const { readers, columns, useTable, addReader, ROWS_PER_PAGE } = useReaders();

  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredData = useMemo(() => {
    return (
      readers?.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? []
    );
  }, [readers, searchQuery]);

  const table = useTable(filteredData);

  const memoizedTable = useMemo(() => {
    return table;
  }, [table]);

  const currentPageData = memoizedTable.getRowModel().rows;

  return (
    <div className="space-y-4 min-w-full">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search readers..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <CreateOpsUserForm addUser={addReader} />
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
              <TableRow key={row.id}>
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
