import { useState } from "react";
import { SearchIcon, UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const mockGroups = Array.from({ length: 10 }, (_, i) => ({
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

  const filteredGroups = mockGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
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
            Selected group:{" "}
            {mockGroups.find((g) => g.id === selectedGroup)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
