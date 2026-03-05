"use client";

import BlurImage from "@/components/blur-image";
import { Skeleton } from "@/components/ui/skeleton";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface PhotographViewProps {
  id: string;
}

// Helper to get the correct image URL (handles both S3 and local paths)
function getImageUrl(url: string): string {
  if (url.startsWith("/")) {
    return url; // Local path, use as-is
  }
  return keyToUrl(url); // S3 key, convert to full URL
}

export const PhotographView = ({ id }: PhotographViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.home.getPhotoById.queryOptions({ id })
  );

  const imageUrl = getImageUrl(data.url);

  return (
    <div className="h-screen flex justify-center items-center relative overflow-hidden bg-black">
      <div className="absolute inset-0 -z-10">
        <BlurImage
          src={imageUrl}
          alt={data.title || "Photo background"}
          fill
          sizes="100vw"
          blurhash={data.blurData}
          className="object-cover blur-lg scale-110"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <BlurImage
        src={imageUrl}
        alt={data.title || "Photo"}
        width={data.width}
        height={data.height}
        blurhash={data.blurData}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const LoadingState = () => {
  return (
    <div className="h-screen flex justify-center items-center relative overflow-hidden bg-black">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted blur-2xl scale-110" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Skeleton className="w-full h-full bg-muted/40" />
    </div>
  );
};
