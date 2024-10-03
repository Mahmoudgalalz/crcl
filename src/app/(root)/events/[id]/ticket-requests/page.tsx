import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Table } from "lucide-react";

export default function TicketRequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Ticket Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* TODO: The click on row should view a modal with the user info */}
              {/* {event.ticketRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "secondary"
                      : request.status === "denied"
                      ? "destructive"
                      : "default"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-24"
                    disabled={request.status !== "pending"}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-24"
                    disabled={request.status !== "pending"}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Deny
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))} */}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {/* Total requests: {event.ticketRequests.length} */}
        </p>
      </CardFooter>
    </Card>
  );
}
