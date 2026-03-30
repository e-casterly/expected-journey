import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
export * from "./schema";

const connectionString = process.env.DATABASE_URL!;

const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool, { schema });
