import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? (global.pgPool ?? new Pool({ connectionString: databaseUrl }))
  : null;

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool ?? undefined;
}

export const db = pool;
