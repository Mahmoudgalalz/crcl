"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  eventName: z.string().min(2).max(50),
  eventDate: z.string().min(2).max(50),
  eventTime: z.string().min(2).max(50),
  eventLocation: z.string().min(2).max(50),
  eventDescription: z.string().min(2).max(50),
  ticketTypes: z
    .array(
      z.object({
        name: z.string().min(2).max(50),
        capacity: z.number().min(1),
      })
    )
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateEventPage() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventDescription: "",
      ticketTypes: [{ name: "", capacity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  useEffect(() => {
    const subscription = form.watch((value) => {
      const ticketTypes = value.ticketTypes || [];
      const isValid =
        ticketTypes.length > 0 &&
        ticketTypes.every(
          (ticket) =>
            ticket?.name?.length !== undefined &&
            ticket?.name?.length >= 2 &&
            ticket?.name?.length <= 50 &&
            ticket?.capacity !== undefined &&
            ticket?.capacity >= 1
        );
      setIsSubmitDisabled(!isValid);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  //TODO: Implement form submission logic here
  function onSubmit(values: FormValues) {
    toast({
      title: "Event created successfully",
      description: "New event has been created successfully",
    });
    console.log(values);
  }

  return (
    <ContentLayout title="Create Event">
      <main className="w-full flex justify-center items-center">
        <div className="container mx-auto pb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Event Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventTime"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Event Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="eventLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="h-32" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Label>Ticket Types</Label>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-end space-x-2 mt-2"
                      >
                        <FormField
                          control={form.control}
                          name={`ticketTypes.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ticket type name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Controller
                          name={`ticketTypes.${index}.capacity`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="w-24">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Capacity"
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={index === 0}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ name: "", capacity: 0 })}
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
                    disabled={isSubmitDisabled}
                  >
                    Create Event
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </ContentLayout>
  );
}
