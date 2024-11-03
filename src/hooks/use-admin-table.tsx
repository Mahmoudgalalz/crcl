import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAdmins, deleteAdmin, changePasswordAdmin } from "@/lib/api/admins";
import { SuperUser } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "./use-toast";
import { Input } from "@/components/ui/input";
import { UserX, Lock } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  newPassword: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

const ROWS_PER_PAGE = 5;

export const useAdminTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperUser | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: admins } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  const { mutate: deleteAdminMutation } = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onMutate: async (deletedAdminId) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });
      const oldAdmins = queryClient.getQueryData(["admins"]);
      queryClient.setQueryData(["admins"], (old: SuperUser[] | undefined) => {
        if (!old) return old;
        return old.filter((admin) => admin.id !== deletedAdminId);
      });
      return { oldAdmins };
    },
    onSuccess: () => {
      toast({
        title: "Admin deleted successfully",
        description: "Admin has been deleted successfully",
      });
    },
    onError: (err, deletedAdmin, context) => {
      queryClient.setQueryData(["admins"], context?.oldAdmins);
      toast({
        title: "Something went wrong.",
        description: "Admin was not deleted. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const handleRevokeAccess = (id: string) => {
    deleteAdminMutation(id);
  };

  const handleChangePassword = async (values: FormValues) => {
    if (selectedAdmin) {
      await changePasswordAdmin(selectedAdmin.id, values.newPassword);
      toast({
        title: "Password changed successfully",
        description: `Password has been changed successfully for admin with name: ${selectedAdmin.name}`,
      });
      setPasswordDialogOpen(false);
      form.reset();
    }
  };

  const columns: ColumnDef<SuperUser>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Dialog
              open={passwordDialogOpen}
              onOpenChange={setPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAdmin(row.original)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Set a new password for {selectedAdmin?.email}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleChangePassword)}>
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
              onClick={() => handleRevokeAccess(row.original.id)}
              disabled={row.original.name === "root"}
            >
              <UserX className="mr-2 h-4 w-4" />
              Revoke Access
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [passwordDialogOpen, selectedAdmin, form]
  );

  const filteredData = useMemo(() => {
    return (
      admins?.filter(
        (admin: SuperUser) =>
          admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [admins, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: ROWS_PER_PAGE,
      },
    },
  });

  const currentPageData = table.getRowModel().rows;

  return {
    searchQuery,
    setSearchQuery,
    currentPageData,
    table,
    filteredData,
    ROWS_PER_PAGE,
    columns,
  };
};
