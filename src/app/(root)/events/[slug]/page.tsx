import { notFound } from "next/navigation";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  MapPin,
} from "lucide-react";
import { ContentLayout } from "@/components/admin-layout";

const events = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-07-15",
    time: "12:00 PM",
    location: "Central Park, New York",
    description: "Join us for a day of music and fun in the sun!",
    ticketTypes: [
      { name: "General Admission", capacity: 5000, available: 3000 },
      { name: "VIP", capacity: 500, available: 100 },
    ],
    ticketRequests: [
      {
        id: 101,
        name: "John Doe",
        email: "john@example.com",
        status: "pending",
        type: "General Admission",
      },
      {
        id: 102,
        name: "Jane Smith",
        email: "jane@example.com",
        status: "approved",
        type: "VIP",
      },
      {
        id: 103,
        name: "Alice Johnson",
        email: "alice@example.com",
        status: "denied",
        type: "General Admission",
      },
    ],
  },
];

export default function EventPage({ params }: { params: { slug: string } }) {
  const eventId = parseInt(params.slug);
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  return (
    <ContentLayout title={event.name}>
      <div className="container mx-auto pb-10">
        <Link href="/events">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{event.name}</CardTitle>
            <CardDescription className="text-zinc-800">
              <div className="flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-grow">
                  {event.date} at {event.time}
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
              {event.ticketTypes.map((type, index) => (
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
              ))}
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
                  {event.ticketRequests.map((request) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Total requests: {event.ticketRequests.length}
            </p>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
