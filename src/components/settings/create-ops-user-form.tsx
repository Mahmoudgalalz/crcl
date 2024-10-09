import { toast } from "@/hooks/use-toast";
import { createUser } from "@/lib/api/users";
import { Gender, User, UserType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(["BOOTH", "READER"]),
  number: z.string().min(10).max(11),
  gender: z.enum(["Male", "Female"]),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateOpsUserForm() {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "BOOTH",
      number: "",
      gender: "Male",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["ops"],
    mutationFn: (formValues: Partial<User>) =>
      createUser(formValues as unknown as Partial<User>),
    onMutate: (formValues: Partial<User>) => {
      console.log(formValues);
      queryClient.setQueryData(["ops"], (old: User[]) => {
        return [...old, formValues];
      });
    },
    onSuccess() {
      form.reset();
      toast({
        title: "Opreation User created!",
        description: "Opreation User successfully!",
      });
    },
  });

  async function onSubmit(data: FormValues) {
    const userData: Partial<User> = {
      number: "+2" + data.number,
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type as UserType,
      gender: data.gender as Gender,
    };
    console.log(userData);
    mutate(userData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
          form.reset();
        })}
      >
        <div className="grid w-full items-center gap-4">
          <div className="flex items-center gap-4 *:flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className=" flex-1 w-full">
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-full">
                      <SelectItem value="BOOTH">Booth</SelectItem>
                      <SelectItem value="READER">Reader</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4 *:flex-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="for example: 01060406445"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-4 *:flex-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-full">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button className="mt-4" type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Create Opreation User
        </Button>
      </form>
    </Form>
  );
}
