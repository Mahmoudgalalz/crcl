"use client";
import { ContentLayout } from "@/components/content-layout";
import { CreateOpsUserForm } from "@/components/ops/create-ops-user-form";
import { OpsTable } from "@/components/ops/ops-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <ContentLayout title="Opreations users">
      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <div className="flex flex-col gap-2">
            <CardTitle>Opreations users Management</CardTitle>
            <CardDescription className="text-zinc-700">
              View and manage opreations users
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Create Operation User
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[800px] max-w-5xl">
              <DialogHeader>
                <DialogTitle>Create New Opreation user</DialogTitle>
                <DialogDescription className="text-zinc-700">
                  Add a new opreation user whether it is a booth or an reader
                </DialogDescription>
              </DialogHeader>
              <CardContent>
                <CreateOpsUserForm />
              </CardContent>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <OpsTable />
      </Card>
    </ContentLayout>
  );
}
