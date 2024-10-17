import { toast } from "@/hooks/use-toast";
import { createUser } from "@/lib/api/users";
import { Gender, User, UserType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomPhoneInput from "@/components/ui/phone-input";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  type: z.string(),
  phone: z.string().min(10).max(13),
  gender: z.string(),
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
      type: "",
      phone: "",
      gender: "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["ops"],
    mutationFn: (formValues: Partial<User>) =>
      createUser(formValues as unknown as Partial<User>),
    onMutate: async (formValues: Partial<User>) => {
      await queryClient.cancelQueries({ queryKey: ["ops"] });
      const previousUsers = queryClient.getQueryData<User[]>(["ops"]);

      queryClient.setQueryData<User[]>(["ops"], (old) => [
        ...(old || []),
        formValues as User,
      ]);

      return { previousUsers };
    },
    onError: (err, formValues, context) => {
      queryClient.setQueryData(["ops"], context?.previousUsers);
      toast({
        title: "Something went wrong.",
        description: "Your operation user was not created. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      form.reset({
        name: "",
        email: "",
        password: "",
        type: "",
        phone: "",
        gender: "",
      });
      toast({
        title: "Operation User created!",
        description: "Operation User created successfully!",
      });
    },
  });

  async function onSubmit(data: FormValues) {
    const userData: Partial<User> = {
      number: data.phone,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BOOTH">Booth</SelectItem>
                    <SelectItem value="READER">Reader</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input type="email" placeholder="Enter Email" {...field} />
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
                  <CustomPhoneInput control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Create Operation User
        </Button>
      </form>
    </Form>
  );
}
