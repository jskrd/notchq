import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

config({
	path: resolve(import.meta.dirname, "../../../.env"),
});

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
