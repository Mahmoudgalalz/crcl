import {
  getNotificationsGroups,
  createNotificationsGroup,
  updateNotificationsGroup,
  deleteNotificationsGroup,
} from "@/lib/api/notification";
import { NotificationGroup } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useState } from "react";

export function useNotificationsGroups({
  selectedGroup,
  onGroupSelect,
}: {
  selectedGroup: string | null;
  onGroupSelect: (groupId: string | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroup, setNewGroup] = useState<Partial<NotificationGroup>>({
    name: "",
    description: "",
  });
  const [editingGroup, setEditingGroup] = useState<NotificationGroup | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<NotificationGroup | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getNotificationsGroups(),
  });

  const { mutate: addGroup } = useMutation({
    mutationKey: ["addGroup"],
    mutationFn: async (newGroup: Partial<NotificationGroup>) => {
      return await createNotificationsGroup(
        newGroup.name,
        newGroup.description
      );
    },
    onMutate: (newGroup) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return [...oldGroups, newGroup as NotificationGroup];
      });
      return { newGroup };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return oldGroups.map((group) =>
          group.id === data.id ? { ...group, ...data } : group
        );
      });
      setNewGroup({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error, newGroup, context) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return oldGroups.filter((group) => group.id !== context.newGroup.id);
      });
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    },
  });

  const { mutate: editGroup } = useMutation({
    mutationKey: ["editGroup"],
    mutationFn: async (newGroup: Partial<NotificationGroup>) => {
      return await updateNotificationsGroup(
        newGroup.id,
        newGroup.name,
        newGroup.description
      );
    },
    onMutate: (newGroup) => {
      queryClient.setQueryData<NotificationGroup[]>(
        ["groups"],
        (oldGroups: NotificationGroup[]) => {
          if (!oldGroups) return [];
          return [
            ...oldGroups.filter((group) => group.id !== newGroup.id),
            {
              ...newGroup,
              id: newGroup.id,
              name: newGroup.name ?? "",
              description: newGroup.description ?? "",
              createdAt: newGroup.createdAt ?? "",
              updatedAt: newGroup.updatedAt ?? "",
            },
          ];
        }
      );
      return { newGroup };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return [
          ...oldGroups.filter((group) => group.id !== data.id),
          data as NotificationGroup,
        ];
      });
      setNewGroup({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error, newGroup, context) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return oldGroups.filter((group) => group.id !== context.newGroup.id);
      });
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    },
  });

  const { mutate: delGroup } = useMutation({
    mutationKey: ["deleteGroup"],
    mutationFn: async (groupId: string) => {
      return await deleteNotificationsGroup(groupId);
    },
    onMutate: (groupId) => {
      const deletedGroup = groups?.find((group) => group.id === groupId);
      queryClient.setQueryData<NotificationGroup[]>(
        ["groups"],
        (oldGroups: NotificationGroup[]) => {
          if (!oldGroups) return [];
          return oldGroups.filter((group) => group.id !== groupId);
        }
      );
      return { deletedGroup };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    onError: (error, groupId, context) => {
      queryClient.setQueryData<NotificationGroup[]>(["groups"], (oldGroups) => {
        if (!oldGroups) return [];
        return [...oldGroups, context.deletedGroup as NotificationGroup];
      });
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    },
  });

  const filteredGroups = groups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addGroup(newGroup);
    setNewGroup({ name: "", description: "" });
    setIsDialogOpen(false);
  };

  const handleEditGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      editGroup(editingGroup);
      setEditingGroup(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteGroup = () => {
    if (groupToDelete) {
      delGroup(groupToDelete.id);
      if (selectedGroup === groupToDelete.id) {
        onGroupSelect(null);
      }
      setGroupToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    groups: filteredGroups,
    handleNewGroupSubmit,
    handleEditGroupSubmit,
    handleDeleteGroup,
    setNewGroup,
    setEditingGroup,
    setGroupToDelete,
    setSearchQuery,
    setIsDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    isDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    newGroup,
    editingGroup,
    groupToDelete,
    searchQuery,
  };
}
