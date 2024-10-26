import { getReaders, getBooths, deleteUser } from "@/lib/api/users";
import { User } from "@/lib/types";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { UserX } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "./use-toast";

const ROWS_PER_PAGE = 5;

export function useOpsTable() {
  const [opsType, setOpsType] = useState<"READER" | "BOOTH">("BOOTH");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: readers } = useQuery({
    queryKey: ["reader"],
    queryFn: getReaders,
  });

  const { data: booths } = useQuery({
    queryKey: ["booth"],
    queryFn: getBooths,
  });

  const { mutate: deleteOpsUser } = useMutation({
    mutationKey: ["ops"],
    mutationFn: (id: string) => deleteUser(id),
    onMutate: (id: string) => {
      queryClient.cancelQueries({ queryKey: [opsType.toLowerCase()] });
      const previousUsers = queryClient.getQueryData([opsType.toLowerCase()]);
      queryClient.setQueryData(
        [opsType.toLowerCase()],
        (oldUsers: User[] | undefined) => {
          if (!oldUsers) return oldUsers;
          return oldUsers.filter((user: User) => user.id !== id);
        }
      );
      return { previousUsers };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData([opsType.toLowerCase()], context?.previousUsers);
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
    const data = opsType === "READER" ? readers : booths?.booths;
    return (
      data?.filter(
        (op) =>
          op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          op.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [readers, booths, opsType, searchQuery]);

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

  return {
    currentPageData,
    setOpsType,
    searchQuery,
    setSearchQuery,
    table,
    ROWS_PER_PAGE,
    opsType,
    filteredData,
    columns,
  };
}
