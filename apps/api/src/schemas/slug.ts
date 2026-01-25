import * as z from "zod";

export const slugSchema = z.stringFormat("slug", /^[a-z0-9-]{1,64}$/);
