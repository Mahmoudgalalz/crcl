"use client";

import Image from "next/image";
import { ContentLayout } from "@/components/content-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { NewspaperForm } from "@/components/newspaper/form";

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
      <div className="container mx-auto p-4 ">
        <div className="flex justify-between items-center mb-4 ">
          <h1 className="text-4xl font-bold ">Newspaper</h1>
          <Button asChild>
            <Link href="/newspaper/create">
              <span className="font-semibold">Create New Announcement</span>
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <Image
                  src={announcement.images[0]}
                  alt={announcement.title}
                  className="w-full h-40 object-cover mb-4 rounded"
                  width={600}
                  height={400}
                />
                <p className="font-bold">{announcement.artist}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {announcement.description}
                </p>
                <div className="flex items-center mb-1">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(announcement.dateTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center mb-1">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{announcement.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="w-4 h-4 mr-2" />
                  <span>{announcement.pricing}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(announcement)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(announcement.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
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
