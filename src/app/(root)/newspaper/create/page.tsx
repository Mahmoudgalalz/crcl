"use client";
import { NewspaperForm } from "@/components/newspaper/form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentLayout } from "@/components/content-layout";

export default function CreateAnnouncement() {
  return (
    <ContentLayout title="New Announcement">
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Announcement
            </CardTitle>
          </CardHeader>
          <NewspaperForm
            onSubmitFn={() => {
              // TODO: Implement the logic to submit the form
            }}
            onDiscardFn={() => {
              // TODO: Implement the logic to discard the form
            }}
          />
        </Card>
      </div>
    </ContentLayout>
  );
}
