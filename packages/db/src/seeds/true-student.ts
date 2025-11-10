import { createSlot } from "../repositories/slot.js";
import { createBusiness } from "@repo/db/repositories/business";
import { createOffering } from "@repo/db/repositories/offering";

export async function seed(): Promise<void> {
  const businesses = await Promise.all([
    createBusiness({
      slug: "true-birmingham",
      name: "true Birmingham",
    }),
    createBusiness({
      slug: "true-glasgow",
      name: "true Glasgow",
    }),
    createBusiness({
      slug: "true-leicester",
      name: "true Leicester",
    }),
    createBusiness({
      slug: "true-liverpool",
      name: "true Liverpool",
    }),
    createBusiness({
      slug: "true-manchester-salford",
      name: "true Manchester, Salford",
    }),
    createBusiness({
      slug: "true-nottingham",
      name: "true Nottingham",
    }),
    createBusiness({
      slug: "true-sheffield",
      name: "true Sheffield",
    }),
    createBusiness({
      slug: "true-swansea",
      name: "true Swansea",
    }),
  ]);

  for (const business of businesses) {
    for (const room of getRooms()) {
      const offering = await createOffering({
        business_id: business.id,
        name: room.number,
        slug: room.number,
        description: `Floor ${room.floor} - Room ${room.number}`,
        timezone: "Europe/London",
        currency: "GBP",
      });

      for (const date of getDates()) {
        await createSlot({
          offering_id: offering.id,
          date,
          time: "00:00",
          duration: 360 * 24 * 60,
          price: 10_000_00,
          capacity: 1,
          published_at: new Date(),
        });
      }
    }
  }
}

function getRooms(): { floor: number; number: string }[] {
  const floors = Array.from({ length: 10 }, (_, i) => i + 1);
  return floors.flatMap((floor) =>
    Array.from({ length: 50 }, (_, i) => ({
      floor,
      number: `${floor}${String(i + 1).padStart(2, "0")}`,
    })),
  );
}

function getDates(): Date[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const results: Date[] = [];

  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    const date = new Date(Date.UTC(year, 8, 1, 0, 0, 0, 0)); // September is 8 (0-indexed)
    results.push(new Date(date));
  }

  return results;
}
