"use client";

import { useState, useMemo } from "react";
import { Lock, UserX, Search, Plus } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { changePasswordAdmin, deleteAdmin, getAdmins } from "@/lib/api/admins";
import { SuperUser } from "@/lib/types";
import { CreateAdminForm } from "./create-admin-form";

const ROWS_PER_PAGE = 5;

const formSchema = z.object({
  newPassword: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperUser | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: admins } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  const { mutate: deleteAdminMutation } = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onMutate: async (deletedAdminId) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });
      const oldAdmins = queryClient.getQueryData(["admins"]);
      queryClient.setQueryData(["admins"], (old: SuperUser[] | undefined) => {
        if (!old) return old;
        return old.filter((admin) => admin.id !== deletedAdminId);
      });
      return { oldAdmins };
    },
    onSuccess: () => {
      toast({
        title: "Admin deleted successfully",
        description: "Admin has been deleted successfully",
      });
    },
    onError: (err, deletedAdmin, context) => {
      queryClient.setQueryData(["admins"], context?.oldAdmins);
      toast({
        title: "Something went wrong.",
        description: "Admin was not deleted. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const handleRevokeAccess = (id: string) => {
    deleteAdminMutation(id);
  };

  const handleChangePassword = async (values: FormValues) => {
    if (selectedAdmin) {
      await changePasswordAdmin(selectedAdmin.id, values.newPassword);
      toast({
        title: "Password changed successfully",
        description: `Password has been changed successfully for admin with name: ${selectedAdmin.name}`,
      });
      setPasswordDialogOpen(false);
      form.reset();
    }
  };

  const columns: ColumnDef<SuperUser>[] = useMemo(
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
        id: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Dialog
              open={passwordDialogOpen}
              onOpenChange={setPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAdmin(row.original)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Set a new password for {selectedAdmin?.email}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleChangePassword)}>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="mt-4">
                      <Button type="submit">Change Password</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRevokeAccess(row.original.id)}
              disabled={row.original.name === "root"}
            >
              <UserX className="mr-2 h-4 w-4" />
              Revoke Access
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [passwordDialogOpen, selectedAdmin, form]
  );

  const filteredData = useMemo(() => {
    return (
      admins?.filter(
        (admin: SuperUser) =>
          admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [admins, searchQuery]);

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
          <Dialog>
            <DialogTrigger asChild>
              <Button type="submit" className="w-fit ">
                <Plus className="mr-2 h-4 w-4" />
                Create Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[800px] max-w-5xl">
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription className="text-zinc-700">
                  Add a new administrator to the system
                </DialogDescription>
              </DialogHeader>

              <CreateAdminForm />
            </DialogContent>
          </Dialog>
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

/**
 *
 */
