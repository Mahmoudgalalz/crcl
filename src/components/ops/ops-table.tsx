"use client";
import { Search } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useOpsTable } from "@/hooks/use-ops-table";

export function OpsTable() {
  const {
    currentPageData,
    ROWS_PER_PAGE,
    filteredData,
    opsType,
    searchQuery,
    setOpsType,
    setSearchQuery,
    table,
    columns,
  } = useOpsTable();

  return (
    <Card className="!border-0">
      <CardContent className="!border-0">
        <div className="flex justify-between ">
          <Tabs
            defaultValue="BOOTH"
            className="mb-4"
            onValueChange={(value) => setOpsType(value as "READER" | "BOOTH")}
          >
            <TabsList>
              <TabsTrigger value="BOOTH">Booth</TabsTrigger>
              <TabsTrigger value="READER">Reader</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-80">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
        {filteredData.length === 0 ? (
          <div className="text-center py-4">
            No {opsType === "BOOTH" ? "Booth" : "Reader"} users found.
          </div>
        ) : (
          <>
            <div className="border rounded-md">
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
                  {currentPageData.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
                    onClick={() => table.previousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => table.setPageIndex(i)}
                      isActive={table.getState().pagination.pageIndex === i}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={
                      !table.getCanNextPage()
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}
