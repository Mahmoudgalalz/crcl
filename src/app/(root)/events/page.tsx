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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, getEvents } from "@/lib/api/events";
import { AnEvent } from "@/lib/types";
import { useState } from "react";

export default function EventsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    refetchOnWindowFocus: true,
    select(data) {
      return data.events;
    },
  });

  const { mutate: mutateTocreateEvent } = useMutation({
    mutationFn: async (formValues: Partial<AnEvent>) => {
      console.log(formValues);
      try {
        return await createEvent({
          ...formValues,
          createdBy: "root",
        } as AnEvent);
      } catch (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event");
      }
    },
    onSuccess: async (newEventData) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });

      const previousEvents = queryClient.getQueryData(["events"]);

      console.log(newEventData);

      console.log(previousEvents);

      queryClient.setQueryData(["events"], {
        events: [
          // Change 'eventsData' to 'events'
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          ...(previousEvents.events ?? []),
          newEventData,
        ],
      });

      return { previousEvents };
    },
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
                  console.log(data);
                  mutateTocreateEvent(data as unknown as AnEvent);
                  setDialogOpen(false);
                }}
                onDiscardFn={() => {
                  setDialogOpen(false);
                }}
                isThereTicketTypes={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EventsGrid events={eventsData} />
    </ContentLayout>
  );
}
