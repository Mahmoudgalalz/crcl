"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lock, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "../ui/card";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { deleteAdmin } from "@/lib/api/admins";
import { SuperUser } from "@/lib/types";

export function AdminsTable({ admins }: { admins: SuperUser[] }) {
  const handleRevokeAccess = async (id: string) => {
    console.log("Revoke access to admin with id: ", id);
    console.log(admins);
    await deleteAdmin(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {/* <TableHead>Last Login</TableHead> */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              {/* <TableCell>{admin.lastLogin}</TableCell> */}
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Set a new password for {admin.email}
                        </DialogDescription>
                      </DialogHeader>
                      {/* <form onSubmit={handleChangePassword}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="new-password"
                              className="text-right"
                            >
                              New Password
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              className="col-span-3"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Change Password</Button>
                        </DialogFooter>
                      </form> */}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeAccess(admin.id)}
                    disabled={admin.name === "root"}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Revoke Access
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
}
