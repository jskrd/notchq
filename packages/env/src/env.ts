import { existsSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url({ protocol: /^https?$/ }),
  DB_URL: z.url({ protocol: /^postgresql$/ }),
  REDIS_URL: z.url({ protocol: /^redis$/ }),
  WWW_NAME: z.string().min(1),
  WWW_URL: z.url({ protocol: /^https?$/ }),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function env(): Env {
  if (_env) {
    return _env;
  }

  loadEnvFile(".env");

  _env = envSchema.parse(process.env);
  return _env;
}

function loadEnvFile(filename: string): void {
  if (!import.meta.dirname) {
    return;
  }

  const envPath = resolve(import.meta.dirname, `../../../${filename}`);
  if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}
