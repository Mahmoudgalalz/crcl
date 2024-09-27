"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";
import { ContentLayout } from "@/components/admin-layout";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [ticketTypes, setTicketTypes] = useState([{ name: "", capacity: 0 }]);

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", capacity: 0 }]);
  };

  const handleRemoveTicketType = (index: number) => {
    const newTicketTypes = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(newTicketTypes);
  };

  const handleTicketTypeChange = (
    index: number,
    field: "name" | "capacity",
    value: string
  ) => {
    const newTicketTypes = [...ticketTypes];
    if (field === "capacity") {
      newTicketTypes[index][field] = parseInt(value) || 0;
    } else {
      newTicketTypes[index][field] = value;
    }
    setTicketTypes(newTicketTypes);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted");

    router.push("/events");
  };

  return (
    <ContentLayout title="Create Event">
      <main className=" w-full flex justify-center items-center">
        <div className="container mx-auto pb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" placeholder="Enter event name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description"
                    className="h-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ticket Types</Label>
                  {ticketTypes.map((ticketType, index) => (
                    <div key={index} className="flex items-end space-x-2">
                      <div className="flex-grow space-y-2">
                        <Input
                          placeholder="Ticket type name"
                          value={ticketType.name}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <Input
                          type="number"
                          placeholder="Capacity"
                          value={ticketType.capacity}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              index,
                              "capacity",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveTicketType(index)}
                        disabled={ticketTypes.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTicketType}
                    className="mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="gap-4 flex-col-reverse lg:flex-row">
                <Button
                  type="button"
                  className="w-full ~text-lg/xl"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="/events">Discard</Link>
                </Button>
                <Button
                  type="submit"
                  className="w-full font-semibold ~text-lg/xl"
                  size="lg"
                >
                  Create Event
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </ContentLayout>
  );
}
