"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAdmin } from "@/lib/api/admins";
import { SuperUser } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAdminForm() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutate } = useMutation({
    mutationFn: (formValues: Partial<SuperUser>) =>
      createAdmin(formValues as SuperUser),

    onSuccess(newAdmin) {
      console.log(newAdmin);
      queryClient.setQueryData(["admins"], (old: SuperUser[]) => {
        return [...old, newAdmin];
      });
      toast({
        title: "Admin created!",
        description: "Admin created successfully!",
      });
    },
  });

  async function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter admin name" {...field} />
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
                  <Input
                    type="email"
                    placeholder="Enter admin email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-4" type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </form>
    </Form>
  );
}
