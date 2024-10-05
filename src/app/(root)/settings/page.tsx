import { ContentLayout } from "@/components/content-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CreateAdminForm } from "@/components/settings/create-admin-form";
import { cookies } from "next/headers";
import { AdminsTable } from "@/components/settings/admin-table";
import { SuperUser } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SettingsPage() {
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

async function AdminsTab() {
  const admins: SuperUser[] = await fetch("http://localhost:2002/admin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
  }).then((res) => res.json());
  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription className="text-zinc-700">
            View and manage system administrators
          </CardDescription>
        </CardHeader>
        <AdminsTable admins={admins} />
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

async function OpsTab() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Opreations users Management</CardTitle>
        <CardDescription className="text-zinc-700">
          View and manage opreations users
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
