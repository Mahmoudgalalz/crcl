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
import { NewspaperItem } from "@/components/newspaper/newspaper-item";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewspaper, getNewspaper } from "@/lib/api/newspaper";
import { useState } from "react";
import { Newspaper } from "@/lib/types";

export default function NewspaperPage() {
  const queryClient = useQueryClient();
  const { data: newspapers } = useQuery({
    queryKey: ["newspapers"],
    queryFn: getNewspaper,
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

      queryClient.setQueryData(
        ["newspapers"],
        [...(previousNewspapers || []), newNewspaper]
      );

      return { previousNewspapers };
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ContentLayout title="Newspaper">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
          {newspapers?.map((newspaper) => (
            <NewspaperItem key={newspaper.id} newspaper={newspaper} />
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
