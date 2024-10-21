"use client";
import { Link } from "next-view-transitions";
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
  UserCog,
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
import { StatusBadge } from "@/components/status-badge";
import { TicketTypeForm } from "@/components/event/ticket-type-form";
import { TicketTypeItem } from "@/components/event/ticket-type-item";
import type { AnEvent, EventStatus, Ticket } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvent } from "@/hooks/use-event";

export default function EventPage({ params }: { params: { id: string } }) {
  const {
    event,
    image,
    editEventDialogOpen,
    setEditEventDialogOpen,
    mutateEvent,
    eventStatusDialog,
    setEventStatusDialog,
    addTicketTypeDialogOpen,
    setAddTicketTypeDialogOpen,
    createTicket,
    remainingEventCapacity,
  } = useEvent({
    params,
  });

  return (
    <ContentLayout title={event?.title ?? ""}>
      <div className="container mx-auto pb-10 w-fit">
        <div className="flex justify-between items-center">
          <Link href="/events">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 size-4" />
              Back to Events
            </Button>
          </Link>
          <Link href={`/events/${params.id}/ticket-requests`}>
            <Button className="mb-4 font-semibold">
              <UserCog className="mr-2 size-4" />
              Ticket Requests
            </Button>
          </Link>
        </div>
        <Card className="mb-6 max-w-3xl min-w-[800px]">
          <CardHeader>
            <img
              src={image}
              alt={event?.title ?? ""}
              width={600}
              height={400}
              className="rounded-md h-48 w-full object-cover mb-2"
            />
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl">{event?.title ?? ""}</h1>
                <StatusBadge status={event?.status ?? ("" as EventStatus)} />
              </div>
              <div className="flex gap-4 items-center flex-row-reverse">
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
                          artists: [
                            ...(event?.artists?.map((artist, idx) => ({
                              id: String(idx),
                              text: artist,
                            })) ?? []),
                          ],
                        }}
                        onSubmitFn={async (data) => {
                          console.log(data);
                          const eventData = {
                            ...data,
                            date: new Date(data.date),
                            image: data.image ?? "",
                          };
                          mutateEvent(eventData as Partial<AnEvent>);
                          setEditEventDialogOpen(false);
                        }}
                        onDiscardFn={() => {
                          setEditEventDialogOpen(false);
                        }}
                        isThereTicketTypes={(event?.tickets?.length ?? 0) > 0}
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={eventStatusDialog}
                  onOpenChange={setEventStatusDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2" variant="outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.7rem"
                        height="1.7rem"
                        viewBox="0 0 24 24"
                      >
                        <g fill="#000000">
                          <path d="M5.636 5.636a1 1 0 0 0-1.414-1.414c-4.296 4.296-4.296 11.26 0 15.556a1 1 0 0 0 1.414-1.414a9 9 0 0 1 0-12.728zm14.142-1.414a1 1 0 1 0-1.414 1.414a9 9 0 0 1 0 12.728a1 1 0 1 0 1.414 1.414c4.296-4.296 4.296-11.26 0-15.556zM8.464 8.464A1 1 0 0 0 7.05 7.05a7 7 0 0 0 0 9.9a1 1 0 0 0 1.414-1.414a5 5 0 0 1 0-7.072zM16.95 7.05a1 1 0 1 0-1.414 1.414a5 5 0 0 1 0 7.072a1 1 0 0 0 1.414 1.414a7 7 0 0 0 0-9.9zM11 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6z" />
                        </g>
                      </svg>
                      <span className="font-semibold">Change Status</span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-xl ">
                    <DialogHeader>
                      <DialogTitle>Change Event Status</DialogTitle>
                      <DialogDescription>
                        Change the event status.
                      </DialogDescription>
                    </DialogHeader>
                    <Select
                      defaultValue={event?.status}
                      onValueChange={(value) => {
                        mutateEvent({
                          status: value as EventStatus,
                        });
                        setEventStatusDialog(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="h-full">
                        <SelectItem value="DRAFTED">Drafted</SelectItem>
                        <SelectItem
                          value="PUBLISHED"
                          disabled={
                            (event?.tickets?.length ?? 0) > 0 ? false : true
                          }
                        >
                          Published
                        </SelectItem>
                        <SelectItem
                          value="ENDED"
                          disabled={
                            (event?.tickets?.length ?? 0) > 0 ? false : true
                          }
                        >
                          Ended
                        </SelectItem>
                        <SelectItem value="CANCLED">Canceled</SelectItem>
                        <SelectItem value="DELETED">Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
            <CardDescription className="text-zinc-800">
              <div className="flex items-center mt-2">
                <Mic2Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event?.artists?.join(", ")}</span>
              </div>
              <div className="flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">
                  {event?.date
                    ? new Date(event.date).toISOString().split("T")[0]
                    : "N/A"}{" "}
                  at {event?.time}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event?.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <Users2 className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">{event?.capacity} Capacity</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event?.description}</p>
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
                      createTicket(ticket as Ticket);
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
              {event &&
                event?.tickets?.map((type, index) => (
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
