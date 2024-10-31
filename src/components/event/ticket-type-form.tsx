"use client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

type InitialData = {
  id: string | null;
  title: string;
  description: string;
  price: number;
  capacity: number;
};

export function TicketTypeForm({
  initialData,
  onSubmitFn,
  onDeleteFn,
  remainingEventCapacity,
}: {
  initialData?: Partial<InitialData>;
  onSubmitFn: (ticket: InitialData) => Promise<unknown>;
  onDeleteFn?: (id: string) => void;
  remainingEventCapacity: number;
}) {
  const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string(),
    price: z.number(),
    capacity: z
      .number()
      .min(1)
      .max(
        initialData?.capacity !== undefined
          ? initialData.capacity + remainingEventCapacity
          : remainingEventCapacity
      ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData as FormValues,
  });
  async function onSubmit(data: FormValues) {
    const ticketData: InitialData = {
      id: initialData?.id ?? null,
      title: data.title,
      description: data.description,
      price: data.price,
      capacity: data.capacity,
    };
    await onSubmitFn(ticketData).then(() => {
      toast({
        title: initialData
          ? "Ticket updated successfully"
          : "Ticket created successfully",
        description: initialData
          ? ""
          : "New ticket has been created successfully",
      });
    });
  }

  const [isDirty, setIsDirty] = useState(false);

  const watch = useWatch({
    control: form.control,
  });

  useEffect(() => {
    setIsDirty(form.formState.isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter Ticket Title" required {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Ticket Price"
                  required
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Ticket Capacity"
                  required
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage>
                {remainingEventCapacity === 0 ? (
                  <p className="text-red-500">
                    The remaining capacity of the event is 0
                  </p>
                ) : (
                  <p className="text-green-500">
                    The remaining capacity of the event is{" "}
                    {remainingEventCapacity}
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter Placeholder"
                  className="h-40"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center gap-4 *:flex-1">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onDeleteFn?.(initialData?.id ?? "");
            }}
            disabled={!initialData?.id}
          >
            Delete
          </Button>
          <Button type="submit" disabled={!isDirty}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
