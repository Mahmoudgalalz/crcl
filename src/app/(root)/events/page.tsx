"use client";
import { ContentLayout } from "@/components/content-layout";
import { EventForm } from "@/components/event/event-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EventsGrid } from "@/components/event/events-grid";
import { useQuery } from "@tanstack/react-query";
import { createEvent, getEvents } from "@/lib/api/events";
import { AnEvent } from "@/lib/types";
import { useState } from "react";

export default function EventsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: eventsData, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    refetchOnWindowFocus: true,
  });
  return (
    <ContentLayout title="Events">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center ">
          <h1 className="~text-2xl/3xl font-bold ">Upcoming Events</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-x-2 items-center justify-center">
                <span className="font-semibold">Create Event</span>
                <Plus size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>Create a new event.</DialogDescription>
              </DialogHeader>
              <EventForm
                onSubmitFn={async (data) => {
                  await createEvent({
                    ...data,
                    createdBy: "root",
                  } as unknown as AnEvent);
                  refetch();
                  setDialogOpen(false);
                }}
                onDiscardFn={() => {
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EventsGrid events={eventsData?.events} />
    </ContentLayout>
  );
}
