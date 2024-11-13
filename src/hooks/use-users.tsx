import { toast } from "@/hooks/use-toast";
import { type User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus, updateUserWallet } from "@/lib/api/users";
import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";

import { debounce } from "@/lib/utils";
import { UsersActions } from "@/components/users/users-actions";

export function useUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pageIndex, setPageIndex] = useState(1);

  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users", pageIndex, searchTerm],
    queryFn: () => getUsers(pageIndex, searchTerm),
  });

  const { mutate: mutateUserStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      await updateUserStatus(id, status),
    onSuccess: async (modUser) => {
      console.log("Mutation started");
      console.log(modUser);
      await queryClient.cancelQueries({ queryKey: ["users"] });

      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user: User) =>
          user.id === modUser?.id ? modUser : user
        );
      });
    },
  });

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const debouncedSearch = debounce((value: string) => {
        setSearchTerm(value);
        setPageIndex(1);
      }, 300);
      debouncedSearch(event.target.value);
    },
    []
  );

  const { mutate: mutateTopUp } = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) =>
      await updateUserWallet(id, amount),

    onSuccess: (walletUpdate) => {
      console.log("Top-up mutation started");

      queryClient.setQueryData(
        ["users", pageIndex, searchTerm],
        (oldData: { users: User[]; meta: unknown } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            users: oldData.users.map((user: User) =>
              user.id === walletUpdate?.userId
                ? {
                    ...user,
                    wallet: {
                      ...user.wallet,
                      balance: walletUpdate.balance,
                    },
                  }
                : user
            ),
          };
        }
      );

      const user = users?.users.find(
        (user) => user.id === walletUpdate?.userId
      );

      toast({
        title: "Wallet topped up",
        description: `Successfully added ${topUpAmount} to ${user?.name}'s wallet.`,
      });
    },
  });

  const toggleUserStatus = (userId: string, user: User) => {
    const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    mutateUserStatus({
      id: userId,
      status: newStatus,
    });
    toast({
      title: `${user.name} is now ${newStatus}`,
    });
  };

  const handleTopUp = () => {
    if (selectedUser && topUpAmount) {
      const amount = parseInt(topUpAmount.toString(), 10);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number.",
          variant: "destructive",
        });
        return;
      }

      mutateTopUp({ id: selectedUser.id, amount });
      setTopUpAmount(null);
      setSelectedUser(null);
    }
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.deletedAt === null ? (
          <Badge
            variant={
              row.original.status === "ACTIVE" ? "default" : "destructive"
            }
          >
            {row.original.status}
          </Badge>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={"destructive"}>DELETED</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Deleted at :{" "}
                  {new Date(row.original.deletedAt).toISOString().split("T")[0]}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
    },
    {
      accessorKey: "wallet.balance",
      header: "Wallet Balance",
      cell: ({ row }) => `${row.original.wallet?.balance || 0}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <UsersActions
          row={row}
          handleTopUp={handleTopUp}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setTopUpAmount={setTopUpAmount}
          toggleUserStatus={toggleUserStatus}
          topUpAmount={topUpAmount}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: users?.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: -1,
    state: {
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    manualPagination: true,
  });

  const memoizedTable = useMemo(() => table, [table]);

  return {
    handleSearch,
    pageIndex,
    setPageIndex,
    table: memoizedTable,
    pagesLimit: users?.meta.totalPages,
  };
}
