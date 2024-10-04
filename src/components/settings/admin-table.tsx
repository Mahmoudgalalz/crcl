"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { changePasswordAdmin, deleteAdmin } from "@/lib/api/admins";
import { SuperUser } from "@/lib/types";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  newPassword: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminsTable({ admins }: { admins: SuperUser[] }) {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const handleRevokeAccess = async (id: string) => {
    console.log("Revoke access to admin with id: ", id);
    console.log(admins);
    await deleteAdmin(id).then(() => {
      window.location.reload();
    });
  };

  const handleChangePassword = async (
    values: FormValues,
    id: string,
    name: string
  ) => {
    await changePasswordAdmin(id, values.newPassword).then(() => {
      toast({
        title: "Password changed successfully",
        description:
          "Password has been changed successfully for admin with name: " + name,
      });
      setPasswordDialogOpen(false);
    });
  };

  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog
                    onOpenChange={setPasswordDialogOpen}
                    open={passwordDialogOpen}
                  >
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
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit((values) =>
                            handleChangePassword(values, admin.id, admin.name)
                          )}
                        >
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter className="mt-4">
                            <Button type="submit">Change Password</Button>
                          </DialogFooter>
                        </form>
                      </Form>
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
          ))}{" "}
        </TableBody>
      </Table>
    </CardContent>
  );
}
