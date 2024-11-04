"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/api/auth";
import { MailIcon, LockIcon } from "lucide-react";
import { CardContent, CardFooter } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuperUserType } from "@/lib/types";

const formSchema = z.object({
  email: z.string().min(2).max(50).email(),
  password: z.string().min(4).max(100),
});

export function LoginForm() {
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
      if (loggedIn.status) {
        const userType = loggedIn.type as SuperUserType;
        switch (userType) {
          case "ADMIN":
            window.location.href = "/dashboard";
            break;
          case "FINANCE":
            window.location.href = "/dashboard";
            break;
          case "MODERATOR":
            window.location.href = "/newspaper";
            break;
          case "APPROVAL":
            window.location.href = "/events";
            break;
          default:
            toast({
              title: "Something went wrong!",
              description: "Your account does not have a valid user type.",
              variant: "destructive",
            });
            break;
        }
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Type your email"
                      className="pl-10 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Type your password"
                      type="password"
                      className="pl-10 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300"
          >
            Log In
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
