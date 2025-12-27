import { z } from "zod";

export const envSchema = z.object({
  WWW_NAME: z.string().min(1),
  WWW_URL: z.url({ protocol: /^https$/ }),
});

export const env = envSchema.parse(process.env);
