"use client";

import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MailsIcon } from "lucide-react";
import CustomPhoneInput from "@/components/ui/phone-input";
import { axiosInstance } from "@/lib/api/instance";

const invitationSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    type: z.enum(["free", "paid"]),
    email: z.string().email("Invalid email address"),
    eventId: z.string().min(1, "Event ID is required"),
    ticketId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "paid" && !data.ticketId) {
        return false;
      }
      return true;
    },
    {
      message: "Ticket ID is required for paid invitations",
      path: ["ticketId"],
    }
  );

type InvitationFormValues = z.infer<typeof invitationSchema>;

export function SendInvitationModal({
  eventId,
  ticketTypes,
}: {
  eventId: string;
  ticketTypes: {
    id: string;
    name: string;
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      eventId,
      type: "free",
    },
  });

  async function onSubmit(data: InvitationFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        number: data.phone,
        type: data.type === "free" ? "Invitation - " + data.ticketId : "paid",
        eventId: data.eventId,
        ...(data.type === "free" ? {} : { ticketId: data.ticketId }),
      };
      const response = await axiosInstance.post("/invitations", payload);

      if (!response.data || response.status === 500) {
        throw new Error("Failed to send invitation");
      }

      toast({
        title: "Invitation sent",
        description: "The invitation has been sent successfully.",
      });
      form.reset();
      setIsOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MailsIcon
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Send Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
          <DialogDescription>
            Fill out the form below to send an invitation to the event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({}) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <CustomPhoneInput
                      control={
                        form.control as Control<
                          {
                            phone: string;
                          },
                          unknown
                        >
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select invitation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") === "free" && (
              <FormField
                control={form.control}
                name="ticketId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Lounge">Lounge</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Required for free invitations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {form.watch("type") === "paid" && (
              <FormField
                control={form.control}
                name="ticketId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ticketTypes.map((ticket) => (
                          <SelectItem key={ticket.id} value={ticket.id}>
                            {ticket.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Required for paid invitations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
