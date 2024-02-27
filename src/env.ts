import { z } from "zod";
import pino from "pino";

const envSchema = z.object({
  APP_VERSION: z.string().default("0.1.0"),
  PORT: z.number().default(3001),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  const issues = envParse.error.issues
    .map((i) => `${i.path} - ${i.message}`)
    .join("; ");
  pino().fatal(
    `Unable to start an application because of missing / invalid environment variables. Issues: ${issues}`
  );
  process.exit(1);
}

export const ENV = envParse.data;
