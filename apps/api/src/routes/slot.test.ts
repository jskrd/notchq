import { defaultHook } from "../app.ts";
import { slotResource } from "../resources/slot.ts";
import { getSlotRoute, getSlotHandler } from "./slot.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createSlot } from "@repo/db/factories";
import { describe, expect, it } from "vitest";

const app = new OpenAPIHono({ defaultHook });
app.openapi(getSlotRoute, getSlotHandler);

describe(`${getSlotRoute.method} ${getSlotRoute.path}`, () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 404",
    async (method) => {
      const response = await app.request("/slots/1", { method });
      expect(response.status).toBe(404);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid id %s",
    async (id) => {
      const response = await app.request(`/slots/${id}`);
      expect(response.status).toBe(404);
    },
  );

  it("returns 404 for non-existent slot", async () => {
    const response = await app.request("/slots/2147483647");
    expect(response.status).toBe(404);
  });

  it("returns the slot as JSON", async () => {
    const slot = await createSlot();

    const response = await app.request(`/slots/${slot.id}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: slotResource(slot),
    });
  });
});
