import businessOfferings from "./routes/business-offerings.ts";
import business from "./routes/business.ts";
import businesses from "./routes/businesses.ts";
import offeringSlots from "./routes/offering-slots.ts";
import offering from "./routes/offering.ts";
import slot from "./routes/slot.ts";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.route("/businesses", businesses);
app.route("/businesses/:id", business);
app.route("/businesses/:id/offerings", businessOfferings);
app.route("/offerings/:id", offering);
app.route("/offerings/:id/slots", offeringSlots);
app.route("/slots/:id", slot);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
