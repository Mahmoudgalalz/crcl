import { CalendarIcon, MapPinIcon, DollarSignIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { Announcement } from "@/lib/types";

export function NewspaperItem({
  announcement,
  handleEdit,
  handleDelete,
}: {
  announcement: Announcement;
  handleEdit: (announcement: Announcement) => void;
  handleDelete: (id: number) => void;
}) {
  return (
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
        <p className="text-sm text-gray-600 mb-2">{announcement.description}</p>
        <div className="flex items-center mb-1">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{new Date(announcement.dateTime).toLocaleString()}</span>
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
        <Button variant="outline" onClick={() => handleEdit(announcement)}>
          Edit
        </Button>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this announcement?</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(announcement.id)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
