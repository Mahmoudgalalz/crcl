import { useState } from "react";
import { SearchIcon, CheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}));

interface UserListProps {
  mode: "single" | "multiple";
  selectedUsers: string[];
  onSelectionChange: (users: string[]) => void;
}

export function UserList({
  mode,
  selectedUsers,
  onSelectionChange,
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    if (mode === "single") {
      onSelectionChange([userId]);
    } else {
      onSelectionChange(
        selectedUsers.includes(userId)
          ? selectedUsers.filter((id) => id !== userId)
          : [...selectedUsers, userId]
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.includes(user.id)
                  ? "bg-primary/5 hover:bg-primary/10"
                  : "hover:bg-accent"
              }`}
              onClick={() => handleUserClick(user.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <img src={user.avatar} alt={user.name} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedUsers.includes(user.id) && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {mode === "multiple" && selectedUsers.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedUsers.length} user{selectedUsers.length !== 1 && "s"}{" "}
            selected
          </p>
        </div>
      )}
    </div>
  );
}
