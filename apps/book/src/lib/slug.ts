import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[-0-9a-z]+$/);
