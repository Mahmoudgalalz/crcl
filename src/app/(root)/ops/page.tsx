"use client";
import { ContentLayout } from "@/components/content-layout";
import { CreateOpsUserForm } from "@/components/settings/create-ops-user-form";
import { OpsTable } from "@/components/settings/ops-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Page() {
  return (
    <ContentLayout title="Opreations users">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Opreations users Management</CardTitle>
          <CardDescription className="text-zinc-700">
            View and manage opreations users
          </CardDescription>
        </CardHeader>
        <OpsTable />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create New Opreation user</CardTitle>
          <CardDescription className="text-zinc-700">
            Add a new opreation user whether it is a booth or an reader
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOpsUserForm />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
