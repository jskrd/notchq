import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));

config({
  path: resolve(currentDir, "../../../.env"),
});

const envSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().min(1).max(65535),
  DB_DATABASE: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function env(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
