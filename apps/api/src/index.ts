import { app } from "./app.ts";
import { serve } from "@hono/node-server";
import { writeFileSync } from "fs";
import { resolve } from "path";

writeFileSync(
  resolve("./public/openapi.json"),
  JSON.stringify(
    app.getOpenAPIDocument({
      openapi: "3.0.0" as const,
      info: { title: "NotchQ API", version: "1.0.0" },
    }),
  ),
);

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
