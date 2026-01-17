import { z } from "zod";

export const envSchema = z.object({
  WWW_NAME: z.string().min(1),
  WWW_URL: z.url({ protocol: /^https$/ }),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
