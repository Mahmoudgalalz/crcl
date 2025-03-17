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
import { useEffect, useState, useMemo } from "react";
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
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const formSchema = z.object({
  title: z.string().min(2),
  date: z.string().min(2),
  time: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(2),
  image: z.string().optional(),
  capacity: z.number().min(1),
  artists: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  status: z
    .enum(["DRAFTED", "PUBLISHED", "ENDED", "CANCLED", "DELETED"])
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Google Maps component for location selection
function LocationSelector({ 
  value, 
  onChange 
}: { 
  value?: { lat?: number; lng?: number }; 
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Update loadError state when apiLoadError changes
  useEffect(() => {
    if (apiLoadError) {
      console.error('Google Maps loading error:', apiLoadError);
      setLoadError(apiLoadError);
    }
  }, [apiLoadError]);

  const center = useMemo(() => ({
    lat: value?.lat || 30.0444, // Default to Alexandria, Egypt
    lng: value?.lng || 31.2357, // Default to Cairo, Egypt
  }), [value?.lat, value?.lng]);

  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(
    value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null
  );

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarker(newPos);
      onChange(newPos);
    }
  };

  if (loadError) return (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center flex-col p-4 text-center rounded-md border border-gray-200">
      <p className="text-red-500 font-medium">Error loading Google Maps</p>
      <p className="text-sm text-gray-600 mt-2">Please check your API key configuration in .env file</p>
      <p className="text-xs text-gray-500 mt-1">Make sure the API key has Maps JavaScript API and Geocoding API enabled</p>
      <div className="mt-4 text-xs bg-gray-200 p-2 rounded w-full max-w-md overflow-auto">
        <p className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=&ldquo;{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'not set'}&rdquo;</p>
      </div>
      <p className="text-xs text-gray-600 mt-4">Technical error: {loadError.message}</p>
    </div>
  );

  if (!isLoaded) return (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <p>Loading Maps...</p>
      </div>
    </div>
  );

  return (
    <div className="h-[300px] sm:h-[400px] w-full rounded-md overflow-hidden border border-gray-200 shadow-sm relative">
      <GoogleMap
        mapContainerStyle={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '0.375rem'
        }}
        center={center}
        zoom={10}
        onClick={handleMapClick}
        options={{
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: false, // Remove map type control to save space on mobile
          zoomControl: true,
          gestureHandling: 'cooperative', // Better for mobile touch
          disableDefaultUI: false,
          scrollwheel: true,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}

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

  const defaultValues: Partial<FormValues> = {
    title: initialData?.title ?? "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : "",
    description: initialData?.description ?? "",
    location: initialData?.location ?? "",
    status: (initialData?.status as FormValues["status"]) ?? "DRAFTED",
    artists: initialData?.artists ?? [],
    // Ensure coordinates default values are properly set
    coordinates: initialData?.coordinates
      ? {
          lat: typeof initialData.coordinates.lat === 'number' 
              ? initialData.coordinates.lat 
              : parseFloat(initialData.coordinates.lat || '0'),
          lng: typeof initialData.coordinates.lng === 'number' 
              ? initialData.coordinates.lng 
              : parseFloat(initialData.coordinates.lng || '0'),
        }
      : undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
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

  const [artists, setArtists] = useState<Tag[]>(
    (initialData?.artists as Tag[]) ?? []
  );

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
                  {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-expect-error - TagInput component expects strict tag type but we're using a more flexible version */}
                  <TagInput
                    activeTagIndex={null}
                    setActiveTagIndex={() => {}}
                    {...field}
                    placeholder="Enter an artist and separate with comma"
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
                    <Input
                      {...field}
                      type="date"
                      min={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                          .toISOString()
                          .split("T")[0]
                      }
                    />
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
            name="coordinates"
            render={({ field }) => (
              <FormItem className="w-full max-w-full">
                <FormLabel>Location on Map</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="lat">Latitude</Label>
                        <Input
                          id="lat"
                          type="number"
                          placeholder="Latitude"
                          value={field.value?.lat?.toString() || ''}
                          step="any"
                          className="mt-1"
                          onChange={(e) => {
                            const lat = parseFloat(e.target.value);
                            if (!isNaN(lat)) {
                              setValue('coordinates', {
                                ...field.value,
                                lat
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="lng">Longitude</Label>
                        <Input
                          id="lng"
                          type="number"
                          placeholder="Longitude"
                          value={field.value?.lng?.toString() || ''}
                          step="any"
                          className="mt-1"
                          onChange={(e) => {
                            const lng = parseFloat(e.target.value);
                            if (!isNaN(lng)) {
                              setValue('coordinates', {
                                ...field.value,
                                lng
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">You can set coordinates by clicking on the map below or entering values directly.</p>
                    <LocationSelector
                      value={field.value}
                      onChange={(coords) => {
                        setValue('coordinates', coords);
                      }}
                    />
                  </div>
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
