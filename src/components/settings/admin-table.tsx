"use client";
import { flexRender } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CreateAdminForm } from "./create-admin-form";
import { useAdminTable } from "@/hooks/use-admin-table";
import { Search } from "lucide-react";

export function AdminsTable() {
  const {
    currentPageData,
    searchQuery,
    setSearchQuery,
    filteredData,
    table,
    ROWS_PER_PAGE,
    columns,
  } = useAdminTable();

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Admin Management</CardTitle>
          <CardDescription className="text-zinc-700">
            View and manage system administrators
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <CreateAdminForm />
          <div className="relative w-80">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 "
              size={20}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="!border-0">
        {filteredData.length === 0 ? (
          <div className="text-center py-4">No admins found.</div>
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
                        : ""
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
                        : ""
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
