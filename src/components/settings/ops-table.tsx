import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserX, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "../ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOps } from "@/lib/api/users";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";

const formSchema = z.object({
  newPassword: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export function OpsTable() {
  const queryClient = useQueryClient();
  const { data: ops } = useQuery({
    queryKey: ["ops"],
    queryFn: getOps,
  });

  const { toast } = useToast();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // await changePasswordOps(values.newPassword);
      setPasswordDialogOpen(false);
      toast({
        title: "Password changed",
        description: "Your password has been changed.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const { mutate: deleteOpsUser } = useMutation({
    mutationKey: ["ops"],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    mutationFn: (id: string) => {
      console.log("Mutation started");
      return console.log("Mutation ended");
    },

    onMutate: (id: string) => {
      queryClient.setQueryData(["ops"], (old: User[]) => {
        return old.filter((user) => user.id !== id);
      });
    },
    onSuccess() {
      toast({
        title: "Opreation User deleted!",
        description: "Opreation User deleted successfully!",
      });
    },
  });
  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Name</TableHead> */}
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ops?.map((opsUser) => (
            <TableRow key={opsUser.id}>
              {/* <TableCell>{opsUser.email}</TableCell> */}
              <TableCell>{opsUser.email}</TableCell>
              <TableCell>{opsUser.type}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog
                    onOpenChange={setPasswordDialogOpen}
                    open={passwordDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Set a new password for {opsUser.email}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit((values) =>
                            onSubmit(values)
                          )}
                        >
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter className="mt-4">
                            <Button type="submit">Change Password</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      console.log("Here", opsUser.id);
                      deleteOpsUser(opsUser.id);
                      console.log("Done");
                    }}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Revoke Access
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}{" "}
        </TableBody>
      </Table>
    </CardContent>
  );
}
