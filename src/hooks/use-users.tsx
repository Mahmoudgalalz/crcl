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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { UserX, UserCheck, Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { debounce } from "@/lib/utils";

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

      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user: User) =>
          user.id === walletUpdate?.userId
            ? {
                ...user,
                wallet: {
                  ...user.wallet,
                  balance: walletUpdate.balance,
                },
              }
            : user
        );
      });

      const user = users?.users.find(
        (user) => user.id === walletUpdate?.userId
      );

      toast({
        title: "Wallet topped up",
        description: `Successfully added ${walletUpdate?.balance} to ${user?.name}'s wallet.`,
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
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
        >
          {row.original.status}
        </Badge>
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
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={row.original.picture}
                      alt={row.original.name}
                    />
                    <AvatarFallback>
                      {row.original.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Name:</span>
                  <span className="col-span-3">{row.original.name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Email:</span>
                  <span className="col-span-3">{row.original.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Number:</span>
                  <span className="col-span-3">{row.original.number}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Gender:</span>
                  <span className="col-span-3">
                    {row.original.gender || "Not specified"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Type:</span>
                  <span className="col-span-3">{row.original.type}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Wallet:</span>
                  <span className="col-span-3">
                    ${row.original.wallet?.balance || 0}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Facebook:</span>
                  <span className="col-span-3">
                    {row.original.facebook || "Not provided"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Instagram:</span>
                  <span className="col-span-3">
                    {row.original.instagram || "Not provided"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Created:</span>
                  <span className="col-span-3">
                    {new Date(row.original.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold">Updated:</span>
                  <span className="col-span-3">
                    {new Date(row.original.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant={
              row.original.status === "ACTIVE" ? "destructive" : "default"
            }
            onClick={() => toggleUserStatus(row.original.id, row.original)}
          >
            {row.original.status === "ACTIVE" ? (
              <UserX className="mr-2 h-4 w-4" />
            ) : (
              <UserCheck className="mr-2 h-4 w-4" />
            )}
            {row.original.status === "ACTIVE" ? "Block" : "Unblock"}
          </Button>
          <Dialog
            open={selectedUser ? true : false}
            onOpenChange={(open) => setSelectedUser(open ? row.original : null)}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setSelectedUser(row.original)}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Top Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Top Up Wallet</DialogTitle>
                <DialogDescription>
                  You are about to top up the wallet of {row.original.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topUpAmount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="topUpAmount"
                    type="number"
                    value={topUpAmount?.toString() || ""}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="col-span-3"
                    required
                    min={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="submit"
                      disabled={!topUpAmount || topUpAmount <= 0}
                    >
                      Top Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Top Up Wallet</DialogTitle>
                    </DialogHeader>
                    You will add ${topUpAmount || 0} to {row.original.name}
                    &apos;s wallet.
                    <DialogFooter>
                      <DialogClose>
                        <Button onClick={handleTopUp}>Top Up</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
