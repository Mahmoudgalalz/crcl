"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAdmin } from "@/lib/api/admins";
import type { SuperUser, SuperUserType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  type: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAdminForm() {
  const queryClient = useQueryClient();
  const [isAddFormDialogOpen, setIsAddFormDialogOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutate } = useMutation({
    mutationFn: (formValues: Partial<SuperUser>) =>
      createAdmin(formValues as SuperUser),
    onMutate: (newAdmin: SuperUser) => {
      queryClient.setQueryData(["admins"], (old: SuperUser[]) => {
        return [...old, newAdmin];
      });
    },
  });

  async function onSubmit(data: FormValues) {
    mutate(
      {
        ...data,
        type: data.type as SuperUserType,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsAddFormDialogOpen(false);
          toast({
            title: "Admin created!",
            description: "Admin created successfully!",
          });
        },
      }
    );
  }

  return (
    <Dialog open={isAddFormDialogOpen} onOpenChange={setIsAddFormDialogOpen}>
      <DialogTrigger asChild>
        <Button type="submit" className="w-fit ">
          <Plus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription className="text-zinc-700">
            Add a new administrator to the system
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex gap-2 items-center *:flex-grow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" flex-1 w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className=" flex-1 w-full">
                      <FormLabel>Type</FormLabel>

                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent className="h-full">
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                          <SelectItem value="MODERATOR">Moderator</SelectItem>
                          <SelectItem value="APPROVAL">Approval</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 items-center *:flex-grow">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
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
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="mt-4" type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Create Admin
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
