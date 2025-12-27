import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));

config({
  path: resolve(currentDir, "../../../.env"),
});

const envSchema = z.object({
  DB_CONNECTION_STRING: z.string().min(1),
});

export const env = envSchema.parse(process.env);
