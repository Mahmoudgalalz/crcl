"use client";
import { ContentLayout } from "@/components/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CreateAdminForm } from "@/components/settings/create-admin-form";
import { AdminsTable } from "@/components/settings/admin-table";

export default function SettingsPage() {
  return (
    <ContentLayout title="Settings">
      <div className="container mx-auto ">
        <h1 className="text-3xl font-bold mb-4">System Settings</h1>
      </div>
      <AdminsTab />
    </ContentLayout>
  );
}

function AdminsTab() {
  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription className="text-zinc-700">
            View and manage system administrators
          </CardDescription>
        </CardHeader>
        <AdminsTable />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
          <CardDescription className="text-zinc-700">
            Add a new administrator to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAdminForm />
        </CardContent>
      </Card>
    </>
  );
}
