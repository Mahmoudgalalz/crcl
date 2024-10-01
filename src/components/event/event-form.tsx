"use client";
import { Label } from "@/components/ui/label";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { z } from "zod";

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

export function EventForm({
  initialData,
  onSubmitFn,
  onDiscardFn,
}: {
  initialData?: FormValues;
  onSubmitFn: (data: FormValues) => Promise<unknown>;
  onDiscardFn?: () => void;
}) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      eventName: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventDescription: "",
      ticketTypes: [],
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
            ticket?.capacity !== undefined &&
            ticket?.capacity >= 1
        );
      setIsSubmitDisabled(!isValid);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  //TODO: Implement form submission logic here
  async function onSubmit(values: FormValues) {
    await onSubmitFn(values).then(() => {
      toast({
        title: "Event created successfully",
        description: "New event has been created successfully",
      });
    });

    console.log(values);
  }

  return (
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
              <div key={field.id} className="flex items-end space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name={`ticketTypes.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder="Ticket type name" />
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
            className="w-full "
            variant="outline"
            asChild
            onClick={onDiscardFn}
          >
            Discard
          </Button>
          <Button
            type="submit"
            className="w-full font-semibold "
            disabled={isSubmitDisabled}
          >
            {initialData ? "Update" : "Create"} Event
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
