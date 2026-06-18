import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/lib/env";

const url = env.DATABASE_URL ?? "libsql://localhost:8080";
const authToken = env.DATABASE_AUTH_TOKEN ?? "placeholder-token-for-build";

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client);
