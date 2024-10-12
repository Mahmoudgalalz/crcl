import { toast } from "@/hooks/use-toast";
import { type User } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus } from "@/lib/api/users";
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
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const users: User[] | undefined = queryClient.getQueryData(["users"]);
      const selectedUser = users?.find((user) => user.id === id);
      if (!selectedUser) throw new Error("User not found");

      console.log(selectedUser);

      return {
        ...selectedUser,
        wallet: {
          ...selectedUser.wallet,
          balance: (selectedUser.wallet?.balance ?? 0) + amount,
        },
      } as User;
    },
    onSuccess: (modUser) => {
      console.log("Top-up mutation started");
      console.log(modUser);

      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map((user: User) =>
          user.id === modUser.id ? modUser : user
        );
      });

      toast({
        title: "Wallet topped up",
        description: `Successfully added ${modUser.wallet?.balance} to ${modUser.name}'s wallet.`,
      });
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.number.includes(searchTerm)
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
