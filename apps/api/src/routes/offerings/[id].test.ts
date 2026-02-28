import { offeringResource } from "../../resources/offering.ts";
import route from "./[id].ts";
import { createOffering } from "@repo/db/factories/index";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

const app = new Hono();
app.route("/offerings/:id", route);

describe("GET /offerings/:id", () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 405",
    async (method) => {
      const response = await app.request("/offerings/1", { method });
      expect(response.status).toBe(405);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid id %s",
    async (id) => {
      const response = await app.request(`/offerings/${id}`);
      expect(response.status).toBe(404);
    },
  );

  it("returns 404 for non-existent offering", async () => {
    const response = await app.request("/offerings/2147483647");
    expect(response.status).toBe(404);
  });

  it("returns 404 for soft-deleted offering", async () => {
    const offering = await createOffering({
      deleted_at: new Date().toISOString(),
    });

    const response = await app.request(`/offerings/${offering.id}`);
    expect(response.status).toBe(404);
  });

  it("returns the offering as JSON", async () => {
    const offering = await createOffering();

    const response = await app.request(`/offerings/${offering.id}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: offeringResource(offering),
    });
  });
});
