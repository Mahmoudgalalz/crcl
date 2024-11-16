"use client";

import { SearchIcon, PlusIcon, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNotificationsGroups } from "@/hooks/use-notifications-groups";

interface GroupListProps {
  selectedGroup: string | null;
  onGroupSelect: (groupId: string | null) => void;
}

export function GroupList({ selectedGroup, onGroupSelect }: GroupListProps) {
  const {
    groups,
    handleDeleteGroup,
    handleEditGroupSubmit,
    handleNewGroupSubmit,
    isDeleteDialogOpen,
    isDialogOpen,
    isEditDialogOpen,
    setEditingGroup,
    setGroupToDelete,
    setNewGroup,
    setSearchQuery,
    setIsDeleteDialogOpen,
    setIsDialogOpen,
    setIsEditDialogOpen,
    newGroup,
    editingGroup,
    groupToDelete,
    searchQuery,
  } = useNotificationsGroups({
    selectedGroup,
    onGroupSelect,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-2">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewGroupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit">Create Group</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {groups?.map((group) => (
            <div
              key={group.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                selectedGroup === group.id
                  ? "bg-primary/10 hover:bg-primary/10"
                  : "hover:bg-accent"
              }`}
              onClick={() => onGroupSelect(group.id)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{group.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGroup(group);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit group</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGroupToDelete(group);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete group</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedGroup && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Selected group: {groups.find((g) => g.id === selectedGroup)?.name}
          </p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditGroupSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name">Group Name</Label>
              <Input
                id="edit-group-name"
                value={editingGroup?.name || ""}
                onChange={(e) =>
                  setEditingGroup(
                    editingGroup
                      ? { ...editingGroup, name: e.target.value }
                      : null
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-group-description">Description</Label>
              <Textarea
                id="edit-group-description"
                value={editingGroup?.description || ""}
                onChange={(e) =>
                  setEditingGroup(
                    editingGroup
                      ? { ...editingGroup, description: e.target.value }
                      : null
                  )
                }
                required
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the group &quot;
              {groupToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
