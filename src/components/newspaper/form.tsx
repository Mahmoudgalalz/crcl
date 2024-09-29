"use client";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { ImageUpload } from "../image-upload";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

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

const formSchema = z.object({
  artist: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  title: z.string().min(2).max(50),
  pricing: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  dateTime: z.string().min(2).max(50),
  promoVideo: z.string().min(2).max(50),
  images: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function NewspaperForm({
  initialData,
  onSubmitFn,
  onDiscardFn,
}: {
  initialData?: Announcement;
  onSubmitFn: (data: Announcement) => void;
  onDiscardFn: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      artist: "",
      description: "",
      title: "",
      pricing: "",
      location: "",
      dateTime: "",
      promoVideo: "",
      images: [],
    },
  });

  const [images, setImages] = useState<ImageFile[]>([]);

  const handleImageUpload = async () => {
    try {
      const imageURLs = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image.file);

          // TODO: Replace the mock upload logic
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          return data.imageUrl;
        })
      );

      return imageURLs;
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const onSubmit = async (values: FormValues) => {
    const imageURLs = await handleImageUpload();
    const newAnnouncement: Announcement = {
      ...values,
      id: Date.now(),
      images: imageURLs || [],
    };

    onSubmitFn(newAnnouncement);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2 w-full">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Pricing</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date and Time</FormLabel>
                <FormControl>
                  <Input {...field} type="datetime-local" />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-24" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Banners</Label>
            <ImageUpload
              images={images}
              setImages={setImages}
              register={form.register}
            />
          </div>

          <FormField
            control={form.control}
            name="promoVideo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Video Link (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="gap-4">
          <Button
            variant="outline"
            className="w-full font-thin ~text-lg/xl"
            onClick={onDiscardFn}
            size="lg"
          >
            Discard
          </Button>
          <Button
            type="submit"
            className="w-full font-semibold ~text-lg/xl"
            size="lg"
            disabled={form.formState.isSubmitting || images.length < 1}
          >
            {initialData ? "Update" : "Create"} Announcement
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
