"use client";
import { ContentLayout } from "@/components/content-layout";
import { OpsTable } from "@/components/ops/ops-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function OpsPage() {
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
        </CardHeader>
        <OpsTable />
      </Card>
    </ContentLayout>
  );
}
