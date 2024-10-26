import { deleteUser, getReaders, createUser } from "@/lib/api/users";
import { User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { useMemo, useState } from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ROWS_PER_PAGE = 5;

export function useReaders() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: readers } = useQuery({
    queryKey: ["reader"],
    queryFn: getReaders,
  });

  const { mutate: deleteReader } = useMutation({
    mutationKey: ["reader"],
    mutationFn: (id: string) => deleteUser(id),
    onMutate: (id: string) => {
      queryClient.cancelQueries({ queryKey: ["reader"] });
      const previousUsers = queryClient.getQueryData(["reader"]);
      queryClient.setQueryData(["reader"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.filter((user: User) => user.id !== id);
      });
      return { previousUsers };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(["reader"], context?.previousUsers);
      toast({
        title: "Something went wrong!",
        description: "Ops User could not be deleted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reader"] });
      toast({
        title: "Reader User deleted!",
        description: "Reader User deleted successfully!",
      });
    },
  });

  const { mutate: addReader } = useMutation({
    mutationKey: ["reader"],
    mutationFn: (newUser: Partial<User>) => createUser(newUser),
    onMutate: (newUser) => {
      queryClient.cancelQueries({ queryKey: ["reader"] });
      const previousUsers = queryClient.getQueryData(["reader"]);
      queryClient.setQueryData(["reader"], (oldUsers: User[] | undefined) => {
        const newUserWithId = { ...newUser, id: Date.now().toString() };
        return oldUsers ? [...oldUsers, newUserWithId] : [newUserWithId];
      });
      return { previousUsers };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(["reader"], context?.previousUsers);
      toast({
        title: "Something went wrong!",
        description: "User could not be added. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["reader"] });
      toast({
        title: "Reader User added!",
        description: "Reader User added successfully!",
      });
    },
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
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
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteReader(row.original.id)}
          >
            <UserX className="mr-2 h-4 w-4" />
            Revoke Access
          </Button>
        ),
      },
    ],
    [deleteReader]
  );

  const table = useReactTable({
    data: readers ?? [],
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

  return {
    readers,
    columns,
    searchQuery,
    setSearchQuery,
    table,
    ROWS_PER_PAGE,
    addReader,
    currentPageData,
  };
}
