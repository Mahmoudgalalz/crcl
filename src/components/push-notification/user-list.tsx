import { useEffect, useState, useCallback } from "react";
import { SearchIcon, CheckIcon } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { getUsers } from "@/lib/api/users";
import type { User } from "@/lib/types";
import { debounce } from "@/lib/utils";

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
  const [inputValue, setInputValue] = useState("");

  const { ref: loadMoreRef, inView } = useInView();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["users", searchQuery],
    queryFn: ({ pageParam }) =>
      getUsers(pageParam ? Number(pageParam) : null, searchQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.meta.totalPages > lastPage?.meta.page
        ? lastPage?.meta.page + 1
        : null,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const allUsers = data?.pages.flatMap((page) => page.users) ?? [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={inputValue}
          onChange={handleInputChange}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading users...
            </p>
          ) : isError ? (
            <p className="text-sm text-destructive text-center py-4">
              Error loading users
            </p>
          ) : allUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No users found
            </p>
          ) : (
            <>
              {allUsers.map((user: User) => (
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
                      <img src={user.picture} alt={user.name.charAt(0)} />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedUsers.includes(user.id) && (
                      <CheckIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
              {hasNextPage && (
                <div ref={loadMoreRef} className="py-2 text-center">
                  {isFetchingNextPage ? (
                    <p className="text-sm text-muted-foreground">
                      Loading more...
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Load more</p>
                  )}
                </div>
              )}
            </>
          )}
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

export default UserList;
