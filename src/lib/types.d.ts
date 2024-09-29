type ImageFile = {
  file: File;
  preview: string;
};

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
