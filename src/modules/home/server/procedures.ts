import z from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  getFeaturedPhotos,
  getCategorySets,
  getPhotoById as getStaticPhotoById,
} from "@/lib/static-photos";

export const homeRouter = createTRPCRouter({
  getManyLikePhotos: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(10),
      })
    )
    .query(async ({ input }) => {
      const { limit } = input;
      const photos = getFeaturedPhotos(limit);
      return photos;
    }),
  getCitySets: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { limit } = input;
      const categories = getCategorySets();
      return categories.slice(0, limit);
    }),
  getPhotoById: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const photo = getStaticPhotoById(id);

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      return photo;
    }),
});
