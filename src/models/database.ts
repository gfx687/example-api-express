import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "./database-types";

const dialect = new PostgresDialect({
  pool: new Pool({
    port: 5432,
    host: "localhost",
    database: "postgres",
    user: "postgres",
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
