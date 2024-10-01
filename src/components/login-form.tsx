"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(4).max(100),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loggedIn = await login(values.email, values.password);
      if (loggedIn) router.push("/dashboard");
      console.log(loggedIn);
    } catch {
      toast({
        title: "Something went wrong!",
        description:
          "Your username or password is incorrect, please try again or contact your administrator.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full "
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full ">
              <FormLabel className="~text-lg/xl">Email</FormLabel>
              <FormControl>
                <Input placeholder="Type your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full ">
              <FormLabel className="~text-lg/xl">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type your password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full ~text-lg/xl font-semibold ">
          Login
        </Button>
      </form>
    </Form>
  );
}
