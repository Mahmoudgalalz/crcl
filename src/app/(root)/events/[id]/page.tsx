"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit,
  Mic2Icon,
  Plus,
  Users2,
} from "lucide-react";
import { ContentLayout } from "@/components/admin-layout";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/event/event-form";
import { EventStatusBadge } from "@/components/status-badge";
import Image from "next/image";
import { TicketTypeForm } from "@/components/event/ticket-type-form";
import { TicketTypeItem } from "@/components/event/ticket-type-item";
import { useQuery } from "@tanstack/react-query";
import { createTicketType, getEvent, updateEvent } from "@/lib/api/events";
import { AnEvent, Ticket } from "@/lib/types";
import { useState } from "react";

export default function EventPage({ params }: { params: { id: string } }) {
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [addTicketTypeDialogOpen, setAddTicketTypeDialogOpen] = useState(false);

  const { data: event, refetch } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getEvent(params.id),
    select: (data) => data.event,
  });

  const image = event?.image?.includes("https://127.0.0.1")
    ? event?.image?.replace("https://", "http://")
    : "/placeholder.jpg";

  const remainingEventCapacity =
    event?.capacity &&
    event?.tickets &&
    event.capacity -
      event.tickets.reduce((acc, ticket) => acc + ticket.capacity, 0);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <ContentLayout title={event.title}>
      <div className="container mx-auto pb-10 w-fit">
        <Link href="/events">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
        <Card className="mb-6 max-w-3xl min-w-[800px]">
          <CardHeader>
            <Image
              src={image}
              alt={event.title}
              width={600}
              height={400}
              className="rounded-md h-48 w-full object-cover mb-2"
            />
            <CardTitle className=" flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="~text-2xl/3xl">{event.title}</h1>
                <EventStatusBadge status={event.status} />
              </div>
              <Dialog
                open={editEventDialogOpen}
                onOpenChange={setEditEventDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Edit size={20} />
                    <span className="font-semibold">Edit Event</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                      Edit the event details.
                    </DialogDescription>
                    <EventForm
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-expect-error
                      initialData={{
                        ...event,
                        artists: event.artists.join(", "),
                      }}
                      onSubmitFn={async (data) => {
                        await updateEvent(
                          {
                            ...data,
                            createdBy: "root",
                          } as unknown as AnEvent,
                          event.id
                        );
                        refetch();
                        setEditEventDialogOpen(false);
                      }}
                      onDiscardFn={() => {
                        setEditEventDialogOpen(false);
                      }}
                      isThereTicketTypes={event.tickets.length > 0}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription className="text-zinc-800">
              <div className="flex items-center mt-2">
                <Mic2Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event.artists.join(", ")}</span>
              </div>
              <div className="flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">
                  {event.date.toString().split("T")[0]} at {event.time}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <Users2 className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event.capacity} Capacity</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.description}</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold mb-2">Ticket Types</h3>
              <Dialog
                open={addTicketTypeDialogOpen}
                onOpenChange={setAddTicketTypeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="p-2">
                    <Plus size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Ticket Type</DialogTitle>
                    <DialogDescription>
                      Add a new ticket type.
                    </DialogDescription>
                  </DialogHeader>
                  <TicketTypeForm
                    remainingEventCapacity={remainingEventCapacity!}
                    onSubmitFn={async (ticket) => {
                      await createTicketType(ticket as Ticket, event.id);
                      refetch();
                      setAddTicketTypeDialogOpen(false);
                    }}
                    onDiscardFn={() => {
                      setAddTicketTypeDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {event.tickets.map((type, index) => (
                <TicketTypeItem
                  ticket={type}
                  key={index}
                  remainingEventCapacity={remainingEventCapacity!}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
