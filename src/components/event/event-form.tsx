"use client";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { ImageUpload } from "../image-upload";
import { ImageFile } from "@/lib/types";
import { uploadImage } from "@/lib/api/upload-image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  date: z.string().min(2).max(50),
  time: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  image: z.string().optional(),
  capacity: z.number().min(1),
  artists: z.string().min(2).max(50),
  status: z.enum(["DRAFTED", "PUBLISHED", "ENDED", "CANCELLED", "DELETED"]),
});

type FormValues = z.infer<typeof formSchema>;

export function EventForm({
  initialData,
  onSubmitFn,
  onDiscardFn,
}: {
  initialData?: FormValues;
  onSubmitFn: (data: FormValues & { artists: string[] }) => Promise<unknown>;
  onDiscardFn?: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date).toISOString().split("T")[0],
        }
      : {
          title: "",
          date: "",
          time: "",
          location: "",
          description: "",
          capacity: 1,
          artists: "",
        },
  });

  const [image, setImage] = useState<ImageFile[]>([]);
  async function onSubmit(values: FormValues) {
    if (image.length > 0) {
      try {
        const res = await uploadImage(image[0]);
        values.image = res?.url ?? "";
      } catch (error) {
        console.error("Image upload failed", error);
        values.image = "";
      }
    }

    const data = {
      ...values,
      capacity: parseInt(values.capacity.toString()),
      date: initialData ? new Date(values.date).toISOString() : values.date,
      artists: values.artists.split(",").map((artist) => artist.trim()),
    };

    await onSubmitFn({
      ...data,
      date: new Date(data.date),
    } as unknown as FormValues & {
      artists: string[];
    }).then(() => {
      toast({
        title: initialData
          ? "Event updated successfully"
          : "Event created successfully",
        description: initialData
          ? ""
          : "New event has been created successfully",
      });
      if (!initialData) {
        router.push("/events");
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              images={image}
              setImages={setImage}
              register={form.register}
            />
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="artists"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artists</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter artist names, separated by commas"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(isNaN(value) ? 1 : value); // Ensure a number is passed
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className=" flex-1 w-full">
                  <FormLabel>Status</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFTED">Drafted</SelectItem>
                      {/* TODO: Disable published if the event don't have tickets */}
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ENDED">Ended</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="DELETED">Deleted</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel> Time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-32" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="gap-4 flex-col-reverse lg:flex-row">
          <Button
            type="button"
            className="w-full "
            variant="outline"
            onClick={() => {
              onDiscardFn?.();
            }}
          >
            Discard
          </Button>
          <Button type="submit" className="w-full font-semibold ">
            {initialData ? "Update" : "Create"} Event
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
