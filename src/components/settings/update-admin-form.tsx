import { Pen, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SuperUser, SuperUserType } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function UpdateAdminForm({
  updateAdminDialogOpen,
  setUpdateAdminDialogOpen,
  setSelectedAdmin,
  selectedAdmin,
  form,
  handleUpdateAdmin,
  handleRevokeAccess,
  row,
}: {
  updateAdminDialogOpen: boolean;
  setUpdateAdminDialogOpen: (open: boolean) => void;
  setSelectedAdmin: (admin: SuperUser | null) => void;
  selectedAdmin: SuperUser | null;
  form: UseFormReturn<
    {
      name?: string;
      password?: string;
      type?: string;
    },
    unknown,
    undefined
  >;
  handleUpdateAdmin: (adminId: string, values: Partial<SuperUser>) => void;
  handleRevokeAccess: (id: string) => void;
  row: SuperUser;
}) {
  return (
    <div className="flex space-x-2">
      <Dialog
        open={updateAdminDialogOpen}
        onOpenChange={setUpdateAdminDialogOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedAdmin(row);
            }}
          >
            <Pen className="size-4 mx-1" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Super User</DialogTitle>
            <DialogDescription>
              Edit info for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                handleUpdateAdmin(selectedAdmin.id, {
                  name: data.name || selectedAdmin.name,
                  ...(data.password ? { password: data.password } : {}),
                  type: (data.type as SuperUserType) || selectedAdmin.type,
                })
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        defaultValue={selectedAdmin.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Type a new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Type</FormLabel>

                    <Select
                      defaultValue={selectedAdmin.type}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent className="h-full">
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="MODERATOR">Moderator</SelectItem>
                        <SelectItem value="APPROVAL">Approval</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4">
                <Button type="submit">Edit Super User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleRevokeAccess(row.id)}
        disabled={row.name === "root"}
      >
        <UserX className="mr-2 h-4 w-4" />
        Revoke Access
      </Button>
    </div>
  );
}
