import AdminPanelLayout from "@/components/admin-panel-layout";
import { RolesMiddleware } from "@/components/role-middleware";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout>
      <RolesMiddleware>{children}</RolesMiddleware>
    </AdminPanelLayout>
  );
}
