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
  // CheckCircle,
  // XCircle,
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
import { AnEvent } from "@/lib/types";
import { cookies } from "next/headers";
import { EventStatusBadge } from "@/components/status-badge";
import Image from "next/image";
import { TicketTypeForm } from "@/components/event/ticket-type-form";
import { TicketTypeItem } from "@/components/event/ticket-type-item";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event: AnEvent = await fetch(
    `http://localhost:2002/events/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.data.event);

  const image = event.image?.includes("https://127.0.0.1")
    ? event.image.replace("https://", "http://")
    : "/placeholder.jpg";

  console.log(event.image);

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
              src={image!}
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
              <Dialog>
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
                      onSubmitFn={async (formValues) => {
                        "use server";
                        console.log(
                          JSON.stringify({
                            ...formValues,
                            image: formValues.image ?? event.image,
                          })
                        );
                        const res = await fetch(
                          `http://localhost:2002/events/${params.id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${
                                cookies().get("token")?.value
                              }`,
                            },
                            body: JSON.stringify({
                              ...formValues,
                              image: formValues.image ?? event.image,
                            }),
                          }
                        ).then((res) => res.json());

                        return res;
                      }}
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
              <Dialog>
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
                    onSubmitFn={async (formValues) => {
                      "use server";
                      const res = await fetch(
                        `http://localhost:2002/events/${event.id}/tickets`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${
                              cookies().get("token")?.value
                            }`,
                          },
                          body: JSON.stringify({
                            title: formValues.title,
                            price: Number(formValues.price),
                            capacity: Number(formValues.capacity),
                            description: formValues.description,
                          }),
                        }
                      ).then((res) => res.json());
                      return res;
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {event.tickets.map((type, index) => (
                <TicketTypeItem ticket={type} key={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
