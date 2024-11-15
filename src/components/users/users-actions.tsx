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
import { useState } from "react";

export function UsersActions({
  row,
  handleTopUp,
  toggleUserStatus,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  handleTopUp: (userId: string, amount: number) => void;
  toggleUserStatus: (id: string, user: User) => void;
}) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const user = row.original;

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

      <Button
        variant={user.status === "ACTIVE" ? "destructive" : "default"}
        onClick={() => toggleUserStatus(user.id, user)}
      >
        {user.status === "ACTIVE" ? (
          <UserX className="mr-2 h-4 w-4" />
        ) : (
          <UserCheck className="mr-2 h-4 w-4" />
        )}
        {user.status === "ACTIVE" ? "Block" : "Unblock"}
      </Button>

      <Dialog open={isTopUpOpen} onOpenChange={onTopUpOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
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
                  You will add ${topUpAmount || 0} to {user.name}&apos;s wallet.
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
    </div>
  );
}
