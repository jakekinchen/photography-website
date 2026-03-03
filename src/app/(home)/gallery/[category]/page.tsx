import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getPhotosByCategory, getCategorySets } from "@/lib/static-photos";
import GalleryView from "@/modules/gallery/ui/views/gallery-view";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: formattedCategory,
    description: `${formattedCategory} photography by Jake Kinchen`,
  };
}

export async function generateStaticParams() {
  const categories = getCategorySets();
  return categories.map((cat) => ({
    category: cat.id,
  }));
}

export default async function GalleryPage({ params }: Props) {
  const { category } = await params;
  const photos = getPhotosByCategory(category);

  if (photos.length === 0) {
    notFound();
  }

  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return <GalleryView title={formattedCategory} photos={photos} />;
}
