import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | null = null;

function buildClient(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Neon Postgres connection string to your environment.",
    );
  }
  return drizzle(neon(url), { schema });
}

export const db = new Proxy({} as Db, {
  get(_, prop) {
    if (!cached) cached = buildClient();
    return Reflect.get(cached, prop);
  },
}) as Db;

export { schema };
