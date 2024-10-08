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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpsTable } from "@/components/settings/ops-table";
import { CreateOpsUserForm } from "@/components/settings/create-ops-user-form";

export default function SettingsPage() {
  return (
    <ContentLayout title="Settings">
      <div className="container mx-auto ">
        <h1 className="text-3xl font-bold mb-4">System Settings</h1>
      </div>
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="ops">Opreations Users</TabsTrigger>
        </TabsList>
        <TabsContent value="admins">
          <AdminsTab />
        </TabsContent>
        <TabsContent value="ops">
          <OpsTab />
        </TabsContent>
      </Tabs>
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

function OpsTab() {
  return (
    <>
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
    </>
  );
}
