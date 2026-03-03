import z from "zod";
import { db } from "@/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { desc, eq, and } from "drizzle-orm";
import { citySets, photos, type CitySet, type Photo } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { getCategorySets } from "@/lib/static-photos";

type TravelCitySet = CitySet & {
  coverPhoto: Photo;
  photos: Photo[];
};

const FALLBACK_DATE = new Date("2024-01-01T00:00:00.000Z");

const toFallbackPhoto = (
  photo: {
    id: string;
    url: string;
    title: string;
    blurData: string;
    aspectRatio: number;
    width: number;
    height: number;
  },
  city: string
): Photo => ({
  id: photo.id,
  url: photo.url.replace(/^\//, ""),
  title: photo.title,
  description: "",
  isFavorite: false,
  visibility: "public",
  aspectRatio: photo.aspectRatio,
  width: photo.width,
  height: photo.height,
  blurData: photo.blurData,
  country: "Gallery",
  countryCode: "--",
  region: null,
  city,
  district: null,
  fullAddress: null,
  placeFormatted: null,
  make: null,
  model: null,
  lensModel: null,
  focalLength: null,
  focalLength35mm: null,
  fNumber: null,
  iso: null,
  exposureTime: null,
  exposureCompensation: null,
  latitude: null,
  longitude: null,
  gpsAltitude: null,
  dateTimeOriginal: FALLBACK_DATE,
  createdAt: FALLBACK_DATE,
  updatedAt: FALLBACK_DATE,
});

const getStaticTravelCitySets = (): TravelCitySet[] => {
  return getCategorySets().map((categorySet) => {
    const city = categorySet.category;
    const photos = categorySet.photos.map((photo) => toFallbackPhoto(photo, city));
    const coverPhoto =
      photos[0] ?? toFallbackPhoto(categorySet.coverPhoto, city);

    return {
      id: categorySet.id,
      description: `${city} photography`,
      country: "Gallery",
      countryCode: "--",
      city,
      coverPhotoId: coverPhoto.id,
      photoCount: photos.length,
      createdAt: FALLBACK_DATE,
      updatedAt: FALLBACK_DATE,
      coverPhoto,
      photos,
    };
  });
};

export const travelRouter = createTRPCRouter({
  getCitySets: baseProcedure.query(async () => {
    if (!db) {
      return getStaticTravelCitySets();
    }

    const data = await db.query.citySets.findMany({
      with: {
        coverPhoto: true,
        photos: true,
      },
      orderBy: [desc(citySets.updatedAt)],
    });

    return data;
  }),
  getOne: baseProcedure
    .input(
      z.object({
        city: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { city } = input;

      if (!db) {
        const staticCitySet = getStaticTravelCitySets().find(
          (item) => item.city.toLowerCase() === city.toLowerCase()
        );

        if (!staticCitySet) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "City not found",
          });
        }

        return {
          id: staticCitySet.id,
          description: staticCitySet.description,
          country: staticCitySet.country,
          countryCode: staticCitySet.countryCode,
          city: staticCitySet.city,
          coverPhotoId: staticCitySet.coverPhotoId,
          photoCount: staticCitySet.photoCount,
          createdAt: staticCitySet.createdAt,
          updatedAt: staticCitySet.updatedAt,
          photos: staticCitySet.photos,
        };
      }

      // Get city set info
      const [citySet] = await db
        .select()
        .from(citySets)
        .where(and(eq(citySets.city, city)));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      // Get all photos in this city
      const cityPhotos = await db
        .select()
        .from(photos)
        .where(and(eq(photos.city, city)))
        .orderBy(desc(photos.dateTimeOriginal), desc(photos.createdAt));

      return {
        ...citySet,
        photos: cityPhotos,
      };
    }),
});
