import { ContentLayout } from "@/components/content-layout";
import { EventForm } from "@/components/event/event-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, TicketIcon, Plus } from "lucide-react";
import Link from "next/link";
const events = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2024-07-15",
    ticketRequestsCount: 150,
    slug: "summer-music-festival",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "2024-09-22",
    ticketRequestsCount: 80,
    slug: "tech-conference-2024",
  },
  {
    id: 3,
    name: "Food Expo",
    date: "2024-08-05",
    ticketRequestsCount: 200,
    slug: "food-expo",
  },
  {
    id: 4,
    name: "International Film Festival",
    date: "2024-10-10",
    ticketRequestsCount: 120,
    slug: "international-film-festival",
  },
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2024-07-15",
    ticketRequestsCount: 150,
    slug: "summer-music-festival",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "2024-09-22",
    ticketRequestsCount: 80,
    slug: "tech-conference-2024",
  },
  {
    id: 3,
    name: "Food Expo",
    date: "2024-08-05",
    ticketRequestsCount: 200,
    slug: "food-expo",
  },
  {
    id: 4,
    name: "International Film Festival",
    date: "2024-10-10",
    ticketRequestsCount: 120,
    slug: "international-film-festival",
  },
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2024-07-15",
    ticketRequestsCount: 150,
    slug: "summer-music-festival",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "2024-09-22",
    ticketRequestsCount: 80,
    slug: "tech-conference-2024",
  },
  {
    id: 3,
    name: "Food Expo",
    date: "2024-08-05",
    ticketRequestsCount: 200,
    slug: "food-expo",
  },
  {
    id: 4,
    name: "International Film Festival",
    date: "2024-10-10",
    ticketRequestsCount: 120,
    slug: "international-film-festival",
  },
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2024-07-15",
    ticketRequestsCount: 150,
    slug: "summer-music-festival",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "2024-09-22",
    ticketRequestsCount: 80,
    slug: "tech-conference-2024",
  },
  {
    id: 3,
    name: "Food Expo",
    date: "2024-08-05",
    ticketRequestsCount: 200,
    slug: "food-expo",
  },
  {
    id: 4,
    name: "International Film Festival",
    date: "2024-10-10",
    ticketRequestsCount: 120,
    slug: "international-film-festival",
  },
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2024-07-15",
    ticketRequestsCount: 150,
    slug: "summer-music-festival",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "2024-09-22",
    ticketRequestsCount: 80,
    slug: "tech-conference-2024",
  },
  {
    id: 3,
    name: "Food Expo",
    date: "2024-08-05",
    ticketRequestsCount: 200,
    slug: "food-expo",
  },
  {
    id: 4,
    name: "International Film Festival",
    date: "2024-10-10",
    ticketRequestsCount: 120,
    slug: "international-film-festival",
  },
];

export default function EventsPage() {
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
      <div className="container mx-auto py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TicketIcon className="mr-2 h-4 w-4" />
                    {event.ticketRequestsCount} ticket requests
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Click to view ticket requests
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
