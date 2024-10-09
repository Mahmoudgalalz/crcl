import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "../ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getOps } from "@/lib/api/users";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";

export function OpsTable() {
  const queryClient = useQueryClient();
  const { data: ops } = useQuery({
    queryKey: ["ops"],
    queryFn: getOps,
  });

  const { toast } = useToast();

  const { mutate: deleteOpsUser } = useMutation({
    mutationKey: ["ops"],
    mutationFn: (id: string) => {
      console.log("Mutation started");
      return deleteUser(id);
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ops?.map((opsUser) => (
            <TableRow key={opsUser.id}>
              <TableCell>{opsUser.name}</TableCell>
              <TableCell>{opsUser.email}</TableCell>
              <TableCell>{opsUser.type}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteOpsUser(opsUser.id);
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
