import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import pg from "pg";

const isLocal = process.env.DATABASE_PROVIDER === "local";
const hasDatabase = !!process.env.DATABASE_URL;

// Create database connection only if DATABASE_URL is provided
// This allows the app to run without a database for static content
function createDb() {
  if (!hasDatabase) {
    return null;
  }

  if (isLocal) {
    return drizzlePg(new pg.Pool({ connectionString: process.env.DATABASE_URL! }), {
      schema,
    });
  }

  return drizzleNeon(neon(process.env.DATABASE_URL!), { schema });
}

const dbClient = createDb();
const missingDbProxy = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Database access attempted without DATABASE_URL. Configure DATABASE_URL or remove DB-backed features."
      );
    },
  }
);

export const db = (dbClient ?? missingDbProxy) as Exclude<typeof dbClient, null>;
