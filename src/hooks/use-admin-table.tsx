import { getAdmins, deleteAdmin, updateAdmin } from "@/lib/api/admins";
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
import { useForm } from "react-hook-form";
import { useToast } from "./use-toast";
import { z } from "zod";
import { UpdateAdminForm } from "@/components/settings/update-admin-form";

const formSchema = z.object({
  name: z.string().optional(),
  password: z.string().min(8).optional(),
  type: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ROWS_PER_PAGE = 5;

export const useAdminTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [updateAdminDialogOpen, setUpdateAdminDialogOpen] = useState(false);
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

  const { mutate: updateAdminMutation } = useMutation({
    mutationKey: ["admins", "update"],
    mutationFn: (variables: { adminId: string; newData: Partial<SuperUser> }) =>
      updateAdmin(variables.adminId, variables.newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });
      const previousAdmins = queryClient.getQueryData(["admins"]);
      queryClient.setQueryData(["admins"], (old: SuperUser[] | undefined) => {
        if (!old) return old;
        return old.map((admin) => {
          if (admin.id === variables.adminId) {
            return {
              ...admin,
              ...variables.newData,
            };
          }
          return admin;
        });
      });
      return { previousAdmins };
    },
    onSuccess: () => {
      toast({
        title: "Admin updated successfully",
        description: "Admin has been updated successfully",
      });
      setUpdateAdminDialogOpen(false);
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["admins"], context?.previousAdmins);
      toast({
        title: "Something went wrong.",
        description: "Admin was not updated. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleRevokeAccess = (id: string) => {
    deleteAdminMutation(id);
  };
  const handleUpdateAdmin = (adminId: string, newData: Partial<SuperUser>) => {
    updateAdminMutation({ adminId, newData });
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
          <UpdateAdminForm
            form={form}
            handleRevokeAccess={handleRevokeAccess}
            row={row.original}
            selectedAdmin={selectedAdmin}
            setSelectedAdmin={setSelectedAdmin}
            updateAdminDialogOpen={updateAdminDialogOpen}
            setUpdateAdminDialogOpen={setUpdateAdminDialogOpen}
            handleUpdateAdmin={handleUpdateAdmin}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateAdminDialogOpen, selectedAdmin, form]
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
