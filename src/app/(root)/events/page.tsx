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
import { cookies } from "next/headers";

export default async function EventsPage() {
  const data = await fetch("http:localhost:2002/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
  }).then((res) => res.json());

  return (
    <ContentLayout title="Events">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center ">
          <h1 className="~text-2xl/3xl font-bold ">Upcoming Events</h1>
          <Dialog>
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
                onSubmitFn={async () => {
                  "use server";
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EventsGrid events={data.events} />
    </ContentLayout>
  );
}
