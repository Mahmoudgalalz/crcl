"use client";

import { ContentLayout } from "@/components/content-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { NewspaperForm } from "@/components/newspaper/newspaper-form";
import { NewspaperItem } from "@/components/newspaper/newspaper-item";
import { ArrowRight } from "lucide-react";
import { Announcement } from "@/lib/types";

// Sample data
const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    artist: "Taylor Swift",
    description:
      "The Eras Tour - A journey through all of Taylor's musical eras.",
    images: ["https://placehold.co/600x400/EEE/31343C"],
    title: "Taylor Swift: The Eras Tour",
    pricing: "$49.99 - $499.99",
    location: "SoFi Stadium, Los Angeles",
    dateTime: "2023-08-05T20:00",
    promoVideo: "https://example.com/taylor-swift-promo.mp4",
  },
  {
    id: 2,
    artist: "Ed Sheeran",
    description: "Mathematics Tour - An intimate evening with Ed Sheeran.",
    images: ["https://placehold.co/600x400/EEE/31343C"],
    title: "Ed Sheeran: Mathematics Tour",
    pricing: "$39.99 - $199.99",
    location: "Wembley Stadium, London",
    dateTime: "2023-09-15T19:30",
  },
];

export default function PostsPage() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <ContentLayout title="Newspaper">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold ">Newspaper</h1>
          <Button size="lg" asChild className="~text-lg/xl">
            <Link href="/newspaper/create" className="flex items-center gap-2">
              <span className="font-semibold">Create Announcement</span>
              <ArrowRight size={25} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
          {announcements.map((announcement) => (
            <NewspaperItem
              key={announcement.id}
              announcement={announcement}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement
                  ? "Edit Announcement"
                  : "Create New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <NewspaperForm
              initialData={editingAnnouncement!}
              onSubmitFn={() => {
                setIsDialogOpen(false);
                setEditingAnnouncement(null);
                //TODO: Implement API call to update announcement
              }}
              onDiscardFn={() => {
                setIsDialogOpen(false);
                setEditingAnnouncement(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
