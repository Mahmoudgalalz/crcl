import { CalendarIcon, CalendarArrowUp } from "lucide-react";
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
import { Newspaper } from "@/lib/types";
import { StatusBadge } from "../status-badge";

export function NewspaperItem({
  newspaper,
}: // handleEdit,
// handleDelete,
{
  newspaper: Newspaper;
  // handleEdit: (announcement: Announcement) => void;
  // handleDelete: (id: number) => void;
}) {
  const image = newspaper.image?.includes("https://127.0.0.1")
    ? newspaper.image.replace("https://", "http://")
    : "/placeholder.jpg";
  return (
    <Card key={newspaper.id} className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">{newspaper.title}</span>
          <StatusBadge status={newspaper.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Image
          src={image!}
          alt={newspaper.title}
          className="w-full h-40 object-cover mb-4 rounded"
          width={600}
          height={400}
        />
        {/* <p className="font-bold">{newspaper.\}</p> */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-balance overflow-ellipsis">
          {newspaper.description}
        </p>
        <div className="flex items-center mb-1 gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>Created at:</span>
          <span className="text-zinc-500">
            {new Date(newspaper.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center mb-1 gap-1">
          <CalendarArrowUp className="w-4 h-4" />
          <span>Last updated at:</span>
          <span className="text-zinc-500">
            {new Date(newspaper.updatedAt).toLocaleString()}
          </span>
        </div>
        {/*   <div className="flex items-center mb-1">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span>{newspaper.location}</span>
        </div>
        <div className="flex items-center">
          <DollarSignIcon className="w-4 h-4 mr-2" />
          <span>{newspaper.pricing}</span>
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {}}>
          Edit
        </Button>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete newspaper</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this newspaper?</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                // onClick={() => handleDelete(newspaper.id)}
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
