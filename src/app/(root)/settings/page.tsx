import { ContentLayout } from "@/components/content-layout";
import { AdminsTable } from "@/components/settings/admin-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <ContentLayout title="Settings">
      <div className="container mx-auto ">
        <h1 className="text-3xl font-bold mb-4">System Settings</h1>
      </div>
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        <TabsContent value="admins">
          <AdminsTab />
        </TabsContent>
        <TabsContent value="wallet">Wallet Settings Here!</TabsContent>
      </Tabs>
    </ContentLayout>
  );
}

function AdminsTab() {
  return (
    <>
      <AdminsTable />
    </>
  );
}
