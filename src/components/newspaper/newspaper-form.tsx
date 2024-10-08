"use client";
import { Label } from "@radix-ui/react-label";
import { useForm, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ImageFile, Newspaper } from "@/lib/types";
import { uploadImage } from "@/lib/api/upload-image";
import { toast } from "@/hooks/use-toast";
import image from "next/image";

const formSchema = z.object({
  description: z.string().min(2).max(200),
  title: z.string().min(2).max(50),
  image: z.string().optional(),
  status: z.enum(["DRAFTED", "PUBLISHED", "DELETED"]),
});

type FormValues = z.infer<typeof formSchema>;

export function NewspaperForm({
  initialData,
  onSubmitFn,
  onDiscardFn,
}: {
  initialData?: Newspaper;
  onSubmitFn: (data: Newspaper) => Promise<unknown>;
  onDiscardFn: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      image: undefined,
      status: "DRAFTED",
    },
  });

  const [images, setImages] = useState<ImageFile[]>([]);

  const onSubmit = async (values: FormValues) => {
    if (images.length > 0) {
      try {
        const res = await uploadImage(images[0]);
        values.image = res?.url ?? "";
      } catch (error) {
        console.error("Image upload failed", error);
        values.image = "";
      }
    }

    await onSubmitFn(values as Newspaper).then(() => {
      toast({
        title: initialData
          ? "Newspaper updated successfully"
          : "Newspaper created successfully",
        description: initialData
          ? ""
          : "New newspaper has been created successfully",
      });
    });
  };

  const [isDirty, setIsDirty] = useState(false);

  const watch = useWatch({
    control: form.control,
  });
  useEffect(() => {
    setIsDirty(form.formState.isDirty || images.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, image]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              images={images}
              setImages={setImages}
              register={form.register}
            />
          </div>
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
                      <SelectItem value="PUBLISHED">Published</SelectItem>
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
            {initialData ? "Update" : "Create"} Newspaper
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
