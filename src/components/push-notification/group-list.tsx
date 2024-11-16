"use client";

import { useState } from "react";
import { SearchIcon, UsersIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const initialGroups: Group[] = Array.from({ length: 10 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: `Group ${i + 1}`,
  description: `Description for Group ${i + 1}`,
  memberCount: Math.floor(Math.random() * 50) + 10,
}));

interface GroupListProps {
  selectedGroup: string | null;
  onGroupSelect: (groupId: string | null) => void;
}

export function GroupList({ selectedGroup, onGroupSelect }: GroupListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroupId = `group-${groups.length + 1}`;
    const groupToAdd: Group = {
      id: newGroupId,
      name: newGroup.name,
      description: newGroup.description,
      memberCount: 1, // Start with 1 member (the creator)
    };
    setGroups([...groups, groupToAdd]);
    setNewGroup({ name: "", description: "" });
    setIsDialogOpen(false);
  };

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
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedGroup === group.id
                  ? "bg-primary/5 hover:bg-primary/10"
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1 text-xs">
                      <UsersIcon className="h-3 w-3" />
                      {group.memberCount} members
                    </Badge>
                  </div>
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
    </div>
  );
}
