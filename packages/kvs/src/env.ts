import { resolve } from "path";
import { z } from "zod";

process.loadEnvFile(resolve(import.meta.dirname, "../../../.env"));

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
