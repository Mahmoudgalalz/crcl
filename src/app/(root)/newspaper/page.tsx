"use client";
import { ContentLayout } from "@/components/content-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewspaperForm } from "@/components/newspaper/newspaper-form";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewspaper, getNewspaper } from "@/lib/api/newspaper";
import { useEffect, useState } from "react";
import { Newspaper } from "@/lib/types";
import { NewspaperGrid } from "@/components/newspaper/newspaper-grid";
import { debounce } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

export default function NewspaperPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [searchQuery]);
  const { data: newspapers } = useQuery({
    queryKey: ["newspapers", { page, searchQuery: debouncedSearchQuery }],
    queryFn: () => getNewspaper(page, debouncedSearchQuery),
  });

  const { mutate: mutateTocreateNewspaper } = useMutation({
    mutationFn: async (formValues: Partial<Newspaper>) => {
      console.log(formValues);
      try {
        return await createNewspaper(formValues);
      } catch (error) {
        console.error("Error updating Newspapers:", error);
        throw new Error("Failed to update Newspapers");
      }
    },
    onSuccess: async (newNewspaper) => {
      await queryClient.cancelQueries({ queryKey: ["newspapers"] });

      const previousNewspapers: Newspaper[] | undefined =
        queryClient.getQueryData(["newspapers"]);

      console.log(previousNewspapers || []);

      queryClient.setQueriesData(
        {
          queryKey: ["newspapers"],
          exact: false,
        },
        [...(previousNewspapers || []), newNewspaper]
      );

      return { previousNewspapers };
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ContentLayout title="Newspapers">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center">
          <h1 className="~text-2xl/3xl font-bold">Newspapers</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-x-2 items-center justify-center">
                <span className="font-semibold">Create Newspaper</span>
                <Plus size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Create Newspaper</DialogTitle>
              </DialogHeader>
              <NewspaperForm
                onSubmitFn={async (data) => {
                  mutateTocreateNewspaper(data);
                  setIsDialogOpen(false);
                }}
                onDiscardFn={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-10"> */}
        {/* {newspapers
            ?.sort((a, b) => {
              const statusOrder = { DRAFTED: 1, PUBLISHED: 2, DELETED: 3 };
              return (
                (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)
              );
            })
            .map((newspaper) => (
              <NewspaperItem key={newspaper.id} newspaper={newspaper} />
            ))} */}
        <NewspaperGrid
          newspapers={newspapers?.newspapers}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(page + 1)}
                className={
                  page === Math.ceil(newspapers?.total / 6)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {/* </div> */}
      </div>
    </ContentLayout>
  );
}
