"use client";

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
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  UserX,
  UserCheck,
  Wallet,
  MoreVerticalIcon,
  BellDotIcon,
  CheckIcon,
  PlusCircleIcon,
  SearchIcon,
  UserPlusIcon,
  XCircleIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NotificationGroup, User } from "@/lib/types";
import { useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card } from "../ui/card";
import { useNotificationsGroups } from "@/hooks/use-notifications-groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserToGroup, delUsersFromGroup } from "@/lib/api/notification";

export function UsersActions({
  row,
  handleTopUp,
  toggleUserStatus,
}: {
  row: { original: User };
  handleTopUp: (userId: string, amount: number) => void;
  toggleUserStatus: (id: string, user: User) => void;
}) {
  const queryClient = useQueryClient();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const user: User = row.original;

  const { groups } = useNotificationsGroups({
    selectedGroup: null,
    onGroupSelect: () => {},
  });

  const handleTopUpSubmit = () => {
    handleTopUp(user.id, topUpAmount);
    setIsTopUpOpen(false);
    setIsConfirmOpen(false);
    setTopUpAmount(0);
  };

  const onTopUpOpen = (open: boolean) => {
    setIsTopUpOpen(open);
    if (!open) {
      setTopUpAmount(0);
      setIsConfirmOpen(false);
    }
  };

  const { mutate: assignUserToGroup } = useMutation({
    mutationKey: ["assignUserToGroup"],
    mutationFn: async (groupId: string) => {
      return await addUserToGroup(groupId, [user.id]);
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: ["users"],
          exact: false,
        },
        (oldUsers: { users: User[]; meta: unknown }) => {
          return {
            users: oldUsers.users.map((oldUser) => {
              if (oldUser.id === user.id) {
                return {
                  ...oldUser,
                  Notifications: [
                    ...oldUser.Notifications,
                    {
                      id: data.id,
                      name: data.name,
                      description: data.description,
                    },
                  ],
                };
              }
              return oldUser;
            }),
            meta: oldUsers.meta,
          };
        }
      );
    },
  });

  const { mutate: delUsersFromGroupMutation } = useMutation({
    mutationKey: ["delUsersFromGroup"],
    mutationFn: async (groupId: string) => {
      return await delUsersFromGroup(groupId, [user.id]);
    },
    onSuccess: (_, groupId) => {
      queryClient.setQueriesData(
        {
          queryKey: ["users"],
          exact: false,
        },
        (oldUsers: { users: User[]; meta: unknown }) => {
          return {
            users: oldUsers.users.map((oldUser) => {
              if (oldUser.id === user.id) {
                return {
                  ...oldUser,
                  Notifications: oldUser.Notifications.filter(
                    (notification) => notification.id !== groupId
                  ),
                };
              }
              return oldUser;
            }),
            meta: oldUsers.meta,
          };
        }
      );
    },
  });

  return (
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
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Name:</span>
              <span className="col-span-3">{user.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Email:</span>
              <span className="col-span-3">{user.email}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Number:</span>
              <span className="col-span-3">{user.number}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Gender:</span>
              <span className="col-span-3">
                {user.gender || "Not specified"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Type:</span>
              <span className="col-span-3">{user.type}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Wallet:</span>
              <span className="col-span-3">${user.wallet?.balance || 0}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Facebook:</span>
              <span className="col-span-3">
                {user.facebook || "Not provided"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Instagram:</span>
              <span className="col-span-3">
                {user.instagram || "Not provided"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Created:</span>
              <span className="col-span-3">
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Updated:</span>
              <span className="col-span-3">
                {new Date(user.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="!p-0 h-full w-full !m-0">
            <MoreVerticalIcon className="size-6 !p-0" />
          </MenubarTrigger>
          <MenubarContent className="border border-gray-400 mr-10 shadow-xl">
            <p className="text-sm p-1">
              <span>
                Actions for <strong>{user.name}</strong>
              </span>
            </p>
            <MenubarSeparator />
            <Dialog open={isTopUpOpen} onOpenChange={onTopUpOpen}>
              <DialogTrigger className="w-full flex items-center text-sm cursor-pointer hover:bg-accent p-1">
                <Wallet className="size-4 mr-2" />
                Top Up
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Top Up Wallet</DialogTitle>
                  <DialogDescription>
                    You are about to top up the wallet of {user.name}
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
                      value={topUpAmount || ""}
                      onChange={(e) => setTopUpAmount(Number(e.target.value))}
                      className="col-span-3"
                      required
                      min={1}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
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
                        <DialogTitle>Confirm Top Up</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        You will add ${topUpAmount || 0} to {user.name}&apos;s
                        wallet.
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleTopUpSubmit}>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className="w-full flex items-center text-sm cursor-pointer hover:bg-accent p-1">
                <BellDotIcon className="size-4 mr-2" />
                Notification Groups
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BellDotIcon className="h-5 w-5" />
                    Manage User Groups
                  </DialogTitle>
                  <DialogDescription className="flex flex-col gap-1">
                    <span>Managing notification groups for {user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search groups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <CheckIcon className="h-4 w-4 text-primary" />
                          Assigned Groups
                        </h3>
                        {user.Notifications.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2">
                            No groups assigned
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {user.Notifications.filter((group) =>
                              group.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            ).map((group) => (
                              <Card key={group.id} className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-sm">
                                        {group.name}
                                      </h4>
                                    </div>
                                    {group.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {group.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      delUsersFromGroupMutation(group.id)
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <XCircleIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <PlusCircleIcon className="h-4 w-4 text-primary" />
                          Available Groups
                        </h3>
                        <div className="space-y-2">
                          {groups
                            ?.filter(
                              (group) =>
                                !user.Notifications.some(
                                  (notification) => notification.id === group.id
                                )
                            )
                            .filter((group) =>
                              group.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((group: NotificationGroup) => (
                              <Card key={group.id} className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-sm">
                                        {group.name}
                                      </h4>
                                    </div>
                                    {group.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {group.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => assignUserToGroup(group.id)}
                                    className="gap-1"
                                  >
                                    <UserPlusIcon className="h-3 w-3" />
                                    Assign
                                  </Button>
                                </div>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <MenubarSeparator />
            <MenubarItem
              className="bg-red-500 hover:bg-red-500/90 text-white cursor-pointer "
              onClick={() => toggleUserStatus(user.id, user)}
            >
              {user.status === "ACTIVE" ? (
                <UserX className="mr-2 h-4 w-4" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4" />
              )}
              {user.status === "ACTIVE" ? "Block" : "Unblock"}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
