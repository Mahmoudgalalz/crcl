"use client";

import Image from "next/image";
import { ContentLayout } from "@/components/content-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";

type Announcement = {
  id: number;
  artist: string;
  description: string;
  images: string[];
  title: string;
  pricing: string;
  location: string;
  dateTime: string;
  promoVideo?: string;
};

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

  const handleSave = (announcement: Announcement) => {
    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((a) => (a.id === announcement.id ? announcement : a))
      );
    } else {
      setAnnouncements([...announcements, { ...announcement, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
  };

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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement
                  ? "Edit Announcement"
                  : "Create New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <AnnouncementForm
              announcement={
                editingAnnouncement || {
                  id: 0,
                  artist: "",
                  description: "",
                  images: [],
                  title: "",
                  pricing: "",
                  location: "",
                  dateTime: "",
                }
              }
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}

function AnnouncementForm({
  announcement,
  onSave,
}: {
  announcement: Announcement;
  onSave: (announcement: Announcement) => void;
}) {
  const [formData, setFormData] = useState(announcement);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="artist">Artist</Label>
        <Input
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="images">Image URL</Label>
        <Input
          id="images"
          name="images"
          value={formData.images[0]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, images: [e.target.value] }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="pricing">Pricing</Label>
        <Input
          id="pricing"
          name="pricing"
          value={formData.pricing}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="dateTime">Date and Time</Label>
        <Input
          id="dateTime"
          name="dateTime"
          type="datetime-local"
          value={formData.dateTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="promoVideo">Promo Video URL (Optional)</Label>
        <Input
          id="promoVideo"
          name="promoVideo"
          value={formData.promoVideo || ""}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Save Announcement</Button>
    </form>
  );
}
