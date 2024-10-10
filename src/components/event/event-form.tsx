"use client";
import { Label } from "@/components/ui/label";
import { useForm, useWatch } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { z } from "zod";
import { ImageUpload } from "../image-upload";
import { ImageFile } from "@/lib/types";
import { uploadImage } from "@/lib/api/upload-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tag, TagInput } from "emblor";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  date: z.string().min(2).max(50),
  time: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  image: z.string().optional(),
  capacity: z.number().min(1),
  artists: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  status: z
    .enum(["DRAFTED", "PUBLISHED", "ENDED", "CANCLED", "DELETED"])
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EventForm({
  initialData,
  onSubmitFn,
  onDiscardFn,
  isThereTicketTypes,
}: {
  initialData?: FormValues;
  onSubmitFn: (data: FormValues & { artists: string[] }) => Promise<unknown>;
  onDiscardFn?: () => void;
  isThereTicketTypes: boolean;
}) {
  const { toast } = useToast();

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
          capacity: undefined,
          artists: [],
          image: "",
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
      date: new Date(values.date).toISOString(),
      artists: values.artists.map((artist) => artist.text),
      status: initialData?.status ?? "DRAFTED",
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
    });
  }

  const [isDirty, setIsDirty] = useState(false);

  const watch = useWatch({
    control: form.control,
  });
  useEffect(() => {
    setIsDirty(form.formState.isDirty || image.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, image]);

  const [artists, setArtists] = useState<Tag[]>(initialData?.artists ?? []);

  const { setValue } = form;

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
                  <TagInput
                    activeTagIndex={null}
                    setActiveTagIndex={() => {}}
                    {...field}
                    placeholder="Enter an artist and seperate with comma, "
                    tags={artists}
                    setTags={(newTags) => {
                      setArtists(newTags);
                      setValue("artists", newTags as [Tag, ...Tag[]]);
                    }}
                    styleClasses={{
                      input: "!shadow-none h-full",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4 w-full items-center">
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
                        field.onChange(isNaN(value) ? 1 : value);
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
                    defaultValue={initialData ? field.value : "DRAFTED"}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-full">
                      <SelectItem value="DRAFTED">Drafted</SelectItem>
                      <SelectItem
                        value="PUBLISHED"
                        disabled={
                          initialData
                            ? isThereTicketTypes
                              ? false
                              : true
                            : true
                        }
                      >
                        Published
                      </SelectItem>
                      <SelectItem
                        value="ENDED"
                        disabled={
                          initialData
                            ? isThereTicketTypes
                              ? false
                              : true
                            : true
                        }
                      >
                        Ended
                      </SelectItem>
                      <SelectItem
                        value="CANCELLED"
                        disabled={initialData ? false : true}
                      >
                        Cancelled
                      </SelectItem>
                      <SelectItem
                        value="DELETED"
                        disabled={initialData ? false : true}
                      >
                        Deleted
                      </SelectItem>
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
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={!isDirty}
          >
            {initialData ? "Update" : "Create"} Event
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
