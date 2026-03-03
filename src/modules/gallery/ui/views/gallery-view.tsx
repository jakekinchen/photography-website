"use client";

import Link from "next/link";
import Image from "next/image";
import { type StaticPhoto } from "@/lib/static-photos";
import VectorCombined from "@/components/vector-combined";
import Footer from "@/components/footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Props {
  title: string;
  photos: StaticPhoto[];
}

export default function GalleryView({ title, photos }: Props) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* LEFT CONTENT - Featured photo */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          {photos[0] && (
            <Image
              src={photos[0].url}
              alt={photos[0].title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
          <div className="absolute right-0 bottom-0 z-10">
            <VectorCombined title={title} position="bottom-right" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Photo grid */}
      <div className="w-full lg:w-1/2 p-3 lg:pl-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <Link
              key={photo.id}
              href={`/p/${encodeURIComponent(photo.id)}`}
              className="group"
            >
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  loading={index < 6 ? "eager" : "lazy"}
                />
              </AspectRatio>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
