import { toast } from "@/hooks/use-toast";
import { type User, type UserStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/users";
import { useState } from "react";

export function useUsers() {
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [users, setUsers] = useState<User[]>(usersData || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.number.includes(searchTerm)
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            status:
              user.status === "ACTIVE"
                ? ("BLOCKED" as UserStatus)
                : ("ACTIVE" as UserStatus),
          };
        }
        return user;
      })
    );
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
      setUsers(
        users.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              wallet: {
                ...user.wallet!,
                balance: (user.wallet?.balance || 0) + amount,
                id: user.wallet?.id || 0,
                userId: user.wallet?.userId || "",
                user: user.wallet?.user || ({} as User),
              },
            };
          }
          return user;
        })
      );
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
