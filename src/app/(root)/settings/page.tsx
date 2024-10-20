import { ContentLayout } from "@/components/content-layout";
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
      <AdminsTable />
    </>
  );
}
