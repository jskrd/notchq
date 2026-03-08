import { offeringCollection, offeringResource } from "./offering.ts";
import { createOffering } from "@repo/db/factories";
import { describe, expect, it } from "vitest";

describe(offeringResource.name, () => {
  it("returns the expected fields", async () => {
    const offering = await createOffering();

    expect(offeringResource(offering)).toEqual({
      id: offering.id,
      business_id: offering.business_id,
      slug: offering.slug,
      name: offering.name,
      description: offering.description,
      image_url: offering.image_url,
      accent_color: offering.accent_color,
      timezone: offering.timezone,
      currency: offering.currency,
      created_at: offering.created_at.toISOString(),
    });
  });
});

describe(offeringCollection.name, () => {
  it("returns an array of offering resources", async () => {
    const offering = await createOffering();

    expect(offeringCollection([offering])).toEqual([
      offeringResource(offering),
    ]);
  });
});
