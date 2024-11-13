"use client";
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

export default function ReaderTable() {
  const {
    columns,
    currentPageData,
    memoizedTable,
    addReader,
    ROWS_PER_PAGE,
    page,
    setPage,
    pagesLimit,
    handleSearchChange,
  } = useReaders();

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
              onClick={() => setPage(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page + 1)}
              className={
                page >= pagesLimit ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
