import { slotResource } from "../../../resources/slot.ts";
import slot from "./[id].ts";
import { createSlot } from "@repo/db/factories/index";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

const app = new Hono();
app.route("/v1/slots/:id", slot);

describe("GET /v1/slots/:id", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 405",
    async (method) => {
      const response = await app.request("/v1/slots/1", { method });
      expect(response.status).toBe(405);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid id %s",
    async (id) => {
      const response = await app.request(`/v1/slots/${id}`);
      expect(response.status).toBe(404);
    },
  );

  it("returns 404 for non-existent slot", async () => {
    const response = await app.request("/v1/slots/2147483647");
    expect(response.status).toBe(404);
  });

  it("returns the slot as JSON", async () => {
    const slot = await createSlot();

    const response = await app.request(`/v1/slots/${slot.id}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: slotResource(slot),
    });
  });
});
