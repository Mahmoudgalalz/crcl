"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ContentLayout } from "@/components/content-layout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";

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
  description: z.string().min(2).max(50),
  title: z.string().min(2).max(50),
  pricing: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  dateTime: z.string().min(2).max(50),
  promoVideo: z.string().min(2).max(50),
  images: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateAnnouncement() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: "",
      description: "",
      images: [],
      title: "",
      pricing: "",
      location: "",
      dateTime: "",
      promoVideo: "",
    },
  });

  const router = useRouter();

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

    // Here you would typically send the newAnnouncement data to your backend API
    console.log("New Announcement:", newAnnouncement);

    // Redirect to the announcements list page (assuming it's at '/announcements')
    router.push("/newspaper");
  };

  return (
    <ContentLayout title="New Announcement">
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Announcement
            </CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
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
                  name="pricing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing</FormLabel>
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
                  onClick={() => router.push("/newspaper")}
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
                  Create Announcement
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </ContentLayout>
  );
}
