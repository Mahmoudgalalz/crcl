import { toast } from "@/hooks/use-toast";
import { type User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus, updateUserWallet } from "@/lib/api/users";
import { useState } from "react";

export function useUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
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

      const user = users?.find((user) => user.id === walletUpdate?.userId);

      toast({
        title: "Wallet topped up",
        description: `Successfully added ${walletUpdate?.balance} to ${user?.name}'s wallet.`,
      });
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users?.filter((user) =>
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return {
    handleSearch,
    searchTerm,
    filteredUsers,
    toggleUserStatus,
    handleTopUp,
    topUpAmount,
    setTopUpAmount,
    selectedUser,
    setSelectedUser,
  };
}
