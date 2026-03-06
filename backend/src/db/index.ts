import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL || "postgres://bloguser:blogpass@localhost:5432/myblog";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
