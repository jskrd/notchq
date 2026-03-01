import { z } from "@hono/zod-openapi";

export const validationErrorSchema: z.ZodType<
  z.core.$ZodFlattenedError<Record<string, unknown>>
> = z
  .object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.string(), z.array(z.string())),
  })
  .openapi("ValidationError");
