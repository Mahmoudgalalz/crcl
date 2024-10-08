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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import { Newspaper, NewsStatus } from "@/lib/types";
import { StatusBadge } from "../status-badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNewspaper } from "@/lib/api/newspaper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

export function NewspaperItem({
  newspaper,
}: // handleEdit,
// handleDelete,
{
  newspaper: Newspaper;
  // handleEdit: (announcement: Announcement) => void;
  // handleDelete: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: mutateNewspaper } = useMutation({
    mutationFn: async ({
      id,
      formValues,
    }: {
      id: string;
      formValues: Partial<Newspaper>;
    }) => {
      try {
        return await updateNewspaper(id, formValues);
      } catch (error) {
        console.error("Error updating Newspaper:", error);
        throw new Error("Failed to update Newspaper");
      }
    },
    onSuccess: async (updatedNewspaper) => {
      await queryClient.cancelQueries({ queryKey: ["newspapers"] });

      const previousNewspapers: Newspaper[] | undefined =
        queryClient.getQueryData(["newspapers"]);

      console.log(previousNewspapers || []);

      queryClient.setQueryData(
        ["newspapers"],
        [
          ...(previousNewspapers || []).map((newspaper) => {
            if (newspaper.id === updatedNewspaper?.id) {
              return updatedNewspaper;
            }
            return newspaper;
          }),
        ]
      );

      return { previousNewspapers };
    },
  });

  const image = newspaper.image?.includes("https://127.0.0.1")
    ? newspaper.image.replace("https://", "http://")
    : "/placeholder.jpg";

  const [isChangeStatus, setIsChangeStatus] = useState(false);
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
        <Dialog open={isChangeStatus} onOpenChange={setIsChangeStatus}>
          <DialogTrigger asChild>
            <Button className="gap-2" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.7rem"
                height="1.7rem"
                viewBox="0 0 24 24"
              >
                <g fill="#000000">
                  <path d="M5.636 5.636a1 1 0 0 0-1.414-1.414c-4.296 4.296-4.296 11.26 0 15.556a1 1 0 0 0 1.414-1.414a9 9 0 0 1 0-12.728zm14.142-1.414a1 1 0 1 0-1.414 1.414a9 9 0 0 1 0 12.728a1 1 0 1 0 1.414 1.414c4.296-4.296 4.296-11.26 0-15.556zM8.464 8.464A1 1 0 0 0 7.05 7.05a7 7 0 0 0 0 9.9a1 1 0 0 0 1.414-1.414a5 5 0 0 1 0-7.072zM16.95 7.05a1 1 0 1 0-1.414 1.414a5 5 0 0 1 0 7.072a1 1 0 0 0 1.414 1.414a7 7 0 0 0 0-9.9zM11 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6z" />
                </g>
              </svg>
              <span className="font-semibold">Change Status</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl ">
            <DialogHeader>
              <DialogTitle>Change Event Status</DialogTitle>
              <DialogDescription>Change the event status.</DialogDescription>
            </DialogHeader>
            <Select
              defaultValue={newspaper.status}
              onValueChange={(value) => {
                mutateNewspaper({
                  id: newspaper.id,
                  formValues: { status: value as NewsStatus },
                });
                setIsChangeStatus(false);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-full">
                <SelectItem value="DRAFTED">Drafted</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
