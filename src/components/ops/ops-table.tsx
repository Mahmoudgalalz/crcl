"use client";

import { useState, useMemo } from "react";
import { UserX } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
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

import { useToast } from "@/hooks/use-toast";
import { deleteUser, getOps } from "@/lib/api/users";
import { User } from "@/lib/types";

const ROWS_PER_PAGE = 5;

export function OpsTable() {
  const [opsType, setOpsType] = useState<"READER" | "BOOTH">("BOOTH");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: ops, isLoading } = useQuery({
    queryKey: ["ops"],
    queryFn: getOps,
  });

  const { mutate: deleteOpsUser } = useMutation({
    mutationKey: ["ops"],
    mutationFn: (id: string) => deleteUser(id),
    onMutate: (id: string) => {
      queryClient.cancelQueries({ queryKey: ["ops"] });
      const previousUsers = queryClient.getQueryData(["ops"]);
      queryClient.setQueryData(["ops"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.filter((user: User) => user.id !== id);
      });
      return { previousUsers };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["ops"], context?.previousUsers);
      toast({
        title: "Something went wrong!",
        description: "Ops User could not be deleted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        title: "Operation User deleted!",
        description: "Operation User deleted successfully!",
      });
    },
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteOpsUser(row.original.id)}
          >
            <UserX className="mr-2 h-4 w-4" />
            Revoke Access
          </Button>
        ),
      },
    ],
    [deleteOpsUser]
  );

  const filteredData = useMemo(() => {
    return ops?.filter((op) => op.type === opsType) || [];
  }, [ops, opsType]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: ROWS_PER_PAGE,
      },
    },
  });

  const currentPageData = table.getRowModel().rows;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="!border-0">
      <CardContent className="!border-0">
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

        {filteredData.length === 0 ? (
          <div className="text-center py-4">
            No entities found for the selected type.
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
                            <TableCell key={`empty-${index}-${columnIndex}`}>
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
