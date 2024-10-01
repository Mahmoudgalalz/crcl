import Image from "next/image";
import { Upload, X } from "lucide-react";
import { type ChangeEvent, type DragEvent } from "react";
import { ImageFile } from "@/lib/types";

export function ImageUpload({
  images,
  setImages,
  register,
}: {
  images: ImageFile[];
  setImages: (images: ImageFile[]) => void;
  register: unknown; // Add register prop
}) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages([...images, ...newFiles]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div>
      <input
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        {...register("images")} // Register the images field
        type="hidden" // Keep it hidden since we handle images separately
      />
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-1 text-sm text-gray-600">
          Drag and drop images here, or click to select files
        </p>
      </div>
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image.preview}
              alt={`Preview ${index}`}
              className="w-full h-32 object-cover rounded-lg"
              width={128}
              height={128}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
