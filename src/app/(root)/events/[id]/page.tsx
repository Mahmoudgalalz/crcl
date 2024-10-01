import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  // CheckCircle,
  // XCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Edit,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const formattedEvent = {
    ...event,
    date: event.date.toString(),
  };

  return (
    <ContentLayout title={event.title}>
      <div className="container mx-auto pb-10 w-fit">
        <Link href="/events">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
        <Card className="mb-6 max-w-3xl min-w-[600px]">
          <CardHeader>
            <CardTitle className=" flex items-center justify-between">
              <div className="flex items-end gap-2">
                <h1 className="~text-2xl/3xl">{event.title}</h1>
                <Badge variant="outline" className="mb-1">
                  Drafted
                </Badge>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Edit size={20} />
                    <span className="font-semibold">Edit Event</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                      Edit the event details.
                    </DialogDescription>
                    <EventForm
                      initialData={{
                        ...formattedEvent,
                        date: formattedEvent.date,
                        artists: formattedEvent.artists.join(", "),
                      }}
                      onSubmitFn={async () => {
                        "use server";
                        // TODO: Implement onSubmitFn
                      }}
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription className="text-zinc-800">
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
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.description}</p>
            <Separator className="my-4" />
            <h3 className="text-xl font-semibold mb-2">Ticket Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* {event.ticketTypes.map((type, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{type.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span>{type.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span>{type.available}</span>
                    </div>
                  </CardContent>
                </Card>
              ))} */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ticket Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* TODO: The click on row should view a modal with the user info */}
                  {/* {event.ticketRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "secondary"
                              : request.status === "denied"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-24"
                            disabled={request.status !== "pending"}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-24"
                            disabled={request.status !== "pending"}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Deny
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {/* Total requests: {event.ticketRequests.length} */}
            </p>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
