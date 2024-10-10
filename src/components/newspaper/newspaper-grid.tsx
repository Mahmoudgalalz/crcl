import React, { useState, useMemo } from "react";
import { Newspaper } from "@/lib/types";
import { NewspaperItem } from "./newspaper-item";
import { Search, Filter } from "lucide-react";
import { Input } from "../ui/input";

export function NewspaperGrid({ newspapers }: { newspapers?: Newspaper[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredNewspapers = useMemo(() => {
    return newspapers
      ?.filter((newspaper) =>
        newspaper.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((newspaper) =>
        statusFilter === "ALL" ? true : newspaper.status === statusFilter
      )
      .sort((a, b) => {
        const statusOrder = { DRAFTED: 1, PUBLISHED: 2, DELETED: 3 };
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      });
  }, [newspapers, searchTerm, statusFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 pt-10 pb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search newspapers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFTED">Drafted</option>
            <option value="PUBLISHED">Published</option>
            <option value="DELETED">Deleted</option>
          </select>
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNewspapers?.map((newspaper) => (
          <NewspaperItem key={newspaper.id} newspaper={newspaper} />
        ))}
      </div>
    </>
  );
}
