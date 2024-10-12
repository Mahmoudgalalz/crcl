"use client";
import { ContentLayout } from "@/components/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserX, UserCheck, Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/use-users";

export default function UsersPage() {
  const {
    filteredUsers,
    handleSearch,
    handleTopUp,
    toggleUserStatus,
    searchTerm,
    topUpAmount,
    setTopUpAmount,
    setSelectedUser,
    selectedUser,
  } = useUsers();
  return (
    <ContentLayout title="Users">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-5">Users Management</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredUsers ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${user.wallet?.balance || 0}</TableCell>
                  <TableCell>
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
                                  src={user.picture}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
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
                              <span className="col-span-3">
                                ${user.wallet?.balance || 0}
                              </span>
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
                      <Button
                        variant={
                          user.status === "ACTIVE" ? "destructive" : "default"
                        }
                        onClick={() => toggleUserStatus(user.id, user)}
                      >
                        {user.status === "ACTIVE" ? (
                          <UserX className="mr-2 h-4 w-4" />
                        ) : (
                          <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        {user.status === "ACTIVE" ? "Block" : "Unblock"}
                      </Button>
                      <Dialog
                        open={selectedUser ? true : false}
                        onOpenChange={(open) =>
                          setSelectedUser(open ? user : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Top Up
                          </Button>
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
                              <Label
                                htmlFor="topUpAmount"
                                className="text-right"
                              >
                                Amount
                              </Label>
                              <Input
                                id="topUpAmount"
                                type="number"
                                value={topUpAmount?.toString() || ""}
                                onChange={(e) =>
                                  setTopUpAmount(Number(e.target.value))
                                }
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
                                You will add ${topUpAmount || 0} to {user.name}
                                &apos;s wallet.
                                <DialogFooter>
                                  <DialogClose>
                                    <Button onClick={handleTopUp}>
                                      Top Up
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  );
}
