import { db } from "@/db";
import { cache } from "react";
import superjson from "superjson";
import { initTRPC } from "@trpc/server";

export const createTRPCContext = cache(async () => {
  return { db };
});

type Context = {
  db: typeof db;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure;
