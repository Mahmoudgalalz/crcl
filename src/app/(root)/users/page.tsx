"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/content-layout";
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
import { useUsers } from "@/hooks/use-users";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersPage() {
  const {
    setPageIndex,
    pageIndex,
    pagesLimit,
    table,
    handleSearch,
  } = useUsers();

  const [localSearchTerm, setLocalSearchTerm] = useState("");

  return (
    <ContentLayout title="Users">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-5">Users Management</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value);
                handleSearch(e);
              }}
              className="pl-8"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {table.getAllColumns().map((column) => (
                <TableHead key={column.id}>
                  {column.columnDef.header as string}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!table.getRowModel().rows.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell
                        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-expect-error
                          cell.column.columnDef.cell(cell)
                        : (cell.getValue() as string)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPageIndex(pageIndex - 1)}
                  className={
                    pageIndex <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{pageIndex}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPageIndex(pageIndex + 1)}
                  className={
                    pageIndex >= pagesLimit
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </ContentLayout>
  );
}
