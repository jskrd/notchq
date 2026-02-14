import { existsSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

const envPath = resolve(
  import.meta.dirname,
  `../../../.env.${process.env["NODE_ENV"]}`,
);
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const envSchema = z.object({
  KVS_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function env(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
