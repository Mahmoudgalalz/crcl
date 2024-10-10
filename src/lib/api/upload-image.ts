import { ImageFile } from "../types";
import { axiosInstance } from "./instance";

export async function uploadImage(image: ImageFile) {
  const formData = new FormData();
  formData.append("image", image.file);

  console.log(formData);

  const res: {
    message: string;
    url: string;
  } = await axiosInstance
    .post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

  return res;
}
