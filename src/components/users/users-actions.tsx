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
import { UserX, UserCheck, Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/lib/types";
export function UsersActions({
  row,
  handleTopUp,
  setTopUpAmount,
  topUpAmount,
  setSelectedUser,
  selectedUser,
  toggleUserStatus,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  handleTopUp: () => void;
  setTopUpAmount: (amount: number) => void;
  topUpAmount: number;
  setSelectedUser: (user: User) => void;
  selectedUser: User;
  toggleUserStatus: (id: string, user: User) => void;
}) {
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
                <AvatarImage
                  src={row.original.picture}
                  alt={row.original.name}
                />
                <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
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
        variant={row.original.status === "ACTIVE" ? "destructive" : "default"}
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
  );
}
