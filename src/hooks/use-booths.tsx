import { deleteUser, createUser, getBooths } from "@/lib/api/users";
import { User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { useMemo } from "react";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ROWS_PER_PAGE = 5;

export function useBooths() {
  const queryClient = useQueryClient();

  const { data: booths } = useQuery({
    queryKey: ["booth"],
    queryFn: getBooths,
  });

  const { mutate: deleteBooths } = useMutation({
    mutationKey: ["booth"],
    mutationFn: (id: string) => deleteUser(id),
    onMutate: (id: string) => {
      queryClient.cancelQueries({ queryKey: ["booth"] });
      const previousUsers = queryClient.getQueryData<{ booths: User[] }>([
        "booth",
      ])?.booths;
      queryClient.setQueryData<{ booths: User[] } | undefined>(
        ["booth"],
        (oldUsers) => {
          if (!oldUsers) return oldUsers;
          return {
            ...oldUsers,
            booths: oldUsers.booths.filter((user: User) => user.id !== id),
          };
        }
      );
      return { previousUsers };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(["booth"], { booths: context?.previousUsers });
      toast({
        title: "Something went wrong!",
        description: "Ops User could not be deleted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["booth"] });
      toast({
        title: "Booth User deleted!",
        description: "Booth User deleted successfully!",
      });
    },
  });

  const { mutate: addBooth } = useMutation({
    mutationKey: ["booth"],
    mutationFn: (newUser: Partial<User>) => createUser(newUser),
    onMutate: (newUser) => {
      queryClient.cancelQueries({ queryKey: ["booth"] });
      const previousUsers = queryClient.getQueryData<{ booths: User[] }>([
        "booth",
      ])?.booths;
      queryClient.setQueryData<{ booths: User[] } | undefined>(
        ["booth"],
        (oldData) => {
          if (!oldData) return oldData;
          const newUserWithId = {
            ...newUser,
            id: Date.now().toString(),
          } as User;
          return { ...oldData, booths: [...oldData.booths, newUserWithId] };
        }
      );
      return { previousUsers };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(["booth"], { booths: context?.previousUsers });
      toast({
        title: "Something went wrong!",
        description: "User could not be added. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["booth"] });
      toast({
        title: "Booth User added!",
        description: "Booth User added successfully!",
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
            onClick={(e) => {
              e.stopPropagation();
              deleteBooths(row.original.id);
            }}
          >
            <UserX className="mr-2 h-4 w-4" />
            Revoke Access
          </Button>
        ),
      },
    ],
    [deleteBooths]
  );

  const useTable = (data: User[]) =>
    useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: ROWS_PER_PAGE,
        },
      },
    });

  return {
    booths,
    columns,
    useTable,
    ROWS_PER_PAGE,
    addBooth,
    tokenPrice: booths?.tokenPrice,
  };
}
