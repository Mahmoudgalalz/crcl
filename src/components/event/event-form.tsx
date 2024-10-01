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

const formSchema = z.object({
  title: z.string().min(2).max(50),
  date: z.string().min(2).max(50).date(),
  time: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  image: z.string().optional(),
  capacity: z.number().min(1),
  artists: z.string().min(2).max(50),
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
    defaultValues: initialData || {
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
      date: new Date(values.date).toISOString(),
      artists: values.artists.split(",").map((artist) => artist.trim()),
    };

    console.log(data);

    await onSubmitFn(data as FormValues & { artists: string[] }).then((res) => {
      console.log(res);
      toast({
        title: "Event created successfully",
        description: "New event has been created successfully",
      });
      router.push("/events");
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
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Event Date</FormLabel>
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
                  <FormLabel>Event Time</FormLabel>
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
                <FormLabel>Event Location</FormLabel>
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
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-32" />
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
        </CardContent>
        <CardFooter className="gap-4 flex-col-reverse lg:flex-row">
          <Button
            type="button"
            className="w-full "
            variant="outline"
            onClick={onDiscardFn}
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
