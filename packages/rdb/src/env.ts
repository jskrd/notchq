import { z } from "zod";

const envSchema = z.object({
  RDB_URL: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function env(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
