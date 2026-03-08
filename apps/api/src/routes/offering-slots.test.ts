import { defaultHook } from "../app.ts";
import { slotCollection } from "../resources/slot.ts";
import {
  listOfferingSlotsRoute,
  listOfferingSlotsHandler,
} from "./offering-slots.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createOffering, createSlot } from "@repo/db/factories";
import { describe, expect, it } from "vitest";

const app = new OpenAPIHono({ defaultHook });
app.openapi(listOfferingSlotsRoute, listOfferingSlotsHandler);

describe(`${listOfferingSlotsRoute.method} ${listOfferingSlotsRoute.path}`, () => {
  it.each(["POST", "PUT", "PATCH", "DELETE"])(
    "%s returns 404",
    async (method) => {
      const response = await app.request("/offerings/1/slots", { method });
      expect(response.status).toBe(404);
    },
  );

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 404 for invalid offering id %s",
    async (id) => {
      const response = await app.request(
        `/offerings/${id}/slots?date=2026-03-01`,
      );
      expect(response.status).toBe(404);
    },
  );

  it("returns 422 when date query param is missing", async () => {
    const offering = await createOffering();
    const response = await app.request(`/offerings/${offering.id}/slots`);
    expect(response.status).toBe(422);
  });

  it("returns 422 for invalid date format", async () => {
    const offering = await createOffering();
    const response = await app.request(
      `/offerings/${offering.id}/slots?date=not-a-date`,
    );
    expect(response.status).toBe(422);
  });

  it.each(["limit=0", "offset=-1"])(
    "returns 422 for invalid pagination %s",
    async (param) => {
      const offering = await createOffering();
      const response = await app.request(
        `/offerings/${offering.id}/slots?date=2026-03-01&${param}`,
      );
      expect(response.status).toBe(422);
    },
  );

  it("returns empty array when no slots match", async () => {
    const offering = await createOffering();

    const response = await app.request(
      `/offerings/${offering.id}/slots?date=2026-03-01`,
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ data: [] });
  });

  it("returns slots for the offering on the given date", async () => {
    const offering = await createOffering();
    const slot = await createSlot({
      offering_id: offering.id,
      start: new Date("2026-03-01T10:00:00.000Z"),
    });

    const response = await app.request(
      `/offerings/${offering.id}/slots?date=2026-03-01`,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch("application/json");

    const body = await response.json();
    expect(body).toEqual({
      data: slotCollection([slot]),
    });
  });

  it("excludes slots on a different date", async () => {
    const offering = await createOffering();
    await createSlot({
      offering_id: offering.id,
      start: new Date("2026-03-02T10:00:00.000Z"),
    });

    const response = await app.request(
      `/offerings/${offering.id}/slots?date=2026-03-01`,
    );

    const body = await response.json();
    expect(body).toEqual({ data: [] });
  });
});
