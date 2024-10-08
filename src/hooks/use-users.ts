import { toast } from "@/hooks/use-toast";
import { type User, type UserStatus } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "@/lib/api/users";
import { useState } from "react";

export function useUsers() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { mutate: mutateToupdateUser } = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<User>;
    }) => await updateUser(id, updatedData),
    onSuccess: async (modUser) => {
      console.log("Mutation started");
      console.log(modUser);
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const users: User[] | undefined = queryClient.getQueryData(["users"]);

      if (users) {
        queryClient.setQueryData(
          ["users"],
          users.map((user: User) => {
            if (user.id === modUser?.id) {
              return modUser;
            } else {
              return user;
            }
          })
        );
      }

      return users;
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    mutateToupdateUser({
      id: userId,
      updatedData: { status: newStatus as UserStatus },
    });
    toast({
      title: `${user.name} is now ${newStatus}`,
    });
  };

  const handleTopUp = () => {
    if (selectedUser && topUpAmount) {
      const amount = parseInt(topUpAmount, 10);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number.",
          variant: "destructive",
        });
        return;
      }
      // setUsers(
      //   users.map((user) => {
      //     if (user.id === selectedUser.id) {
      //       return {
      //         ...user,
      //         wallet: {
      //           ...user.wallet!,
      //           balance: (user.wallet?.balance || 0) + amount,
      //           id: user.wallet?.id || 0,
      //           userId: user.wallet?.userId || "",
      //           user: user.wallet?.user || ({} as User),
      //         },
      //       };
      //     }
      //     return user;
      //   })
      // );
      setTopUpAmount("");
      setSelectedUser(null);
      toast({
        title: "Wallet topped up",
        description: `Successfully added ${amount} to ${selectedUser.name}'s wallet.`,
      });
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
