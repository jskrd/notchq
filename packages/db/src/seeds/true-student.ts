import { db } from "@repo/db/database";
import type {
  Business,
  NewOffering,
  NewSlot,
  Offering,
  Slot,
} from "@repo/db/types";
import { RRule } from "rrule";

export async function seed(): Promise<void> {
  const businesses = await seedBusinesses();
  const offerings = await seedOfferings(businesses);
  await seedSlots(offerings);
}

async function seedBusinesses(): Promise<Business[]> {
  return await db
    .insertInto("businesses")
    .values([
      {
        slug: "true-birmingham",
        name: "true Birmingham",
      },
      {
        slug: "true-glasgow",
        name: "true Glasgow",
      },
      {
        slug: "true-leicester",
        name: "true Leicester",
      },
      {
        slug: "true-liverpool",
        name: "true Liverpool",
      },
      {
        slug: "true-manchester-salford",
        name: "true Manchester, Salford",
      },
      {
        slug: "true-nottingham",
        name: "true Nottingham",
      },
      {
        slug: "true-sheffield",
        name: "true Sheffield",
      },
      {
        slug: "true-swansea",
        name: "true Swansea",
      },
    ])
    .returningAll()
    .execute();
}

async function seedOfferings(businesses: Business[]): Promise<Offering[]> {
  const floorsPerBuildingCount = 8;
  const roomsPerFloorCount = 32;

  // Define room types with their characteristics
  const roomTypes = [
    {
      type: "Standard",
      suffix: "S",
      description: "Standard room with shared bathroom facilities",
    },
    {
      type: "En-Suite",
      suffix: "E",
      description: "En-suite room with private bathroom",
    },
    {
      type: "Studio",
      suffix: "ST",
      description: "Self-contained studio with kitchenette and en-suite",
    },
  ];

  const floors = Array.from(
    { length: floorsPerBuildingCount },
    (_, i) => i + 1,
  );

  const newOfferings: NewOffering[] = [];
  for (const business of businesses) {
    for (const floor of floors) {
      for (let roomNum = 1; roomNum <= roomsPerFloorCount; roomNum++) {
        // Distribute room types: 50% En-Suite, 30% Standard, 20% Studio
        let roomType;
        const rand = roomNum % 10;
        if (rand < 5) {
          roomType = roomTypes[1]; // En-Suite
        } else if (rand < 8) {
          roomType = roomTypes[0]; // Standard
        } else {
          roomType = roomTypes[2]; // Studio
        }

        const roomNumber = `${floor}${String(roomNum).padStart(2, "0")}`;
        const roomSlug = `${roomNumber}-${roomType.suffix.toLowerCase()}`;

        newOfferings.push({
          business_id: business.id,
          name: `Room ${roomNumber} (${roomType.type})`,
          slug: roomSlug,
          description: `Floor ${floor} - ${roomType.description}`,
          timezone: "Europe/London",
          currency: "GBP",
        });
      }
    }
  }

  return await db
    .insertInto("offerings")
    .values(newOfferings)
    .returningAll()
    .execute();
}

async function seedSlots(offerings: Offering[]): Promise<Slot[]> {
  const now = new Date();
  const currentYear = now.getFullYear();

  const academicYearStartYear =
    now.getMonth() >= 8 ? currentYear : currentYear - 1;

  const rrule = new RRule({
    freq: RRule.YEARLY,
    dtstart: new Date(academicYearStartYear, 8, 15, 0, 0, 0),
    count: 2,
  });

  // Base pricing by room type (44-week contract)
  const roomTypePricing: Record<string, number> = {
    s: 7_500_00, // Standard: £7,500
    e: 9_500_00, // En-Suite: £9,500
    st: 11_500_00, // Studio: £11,500
  };

  // City multipliers (some cities are more expensive)
  const cityMultipliers: Record<string, number> = {
    "true-birmingham": 1.0,
    "true-glasgow": 0.9, // Slightly cheaper
    "true-leicester": 0.85, // More affordable
    "true-liverpool": 0.95,
    "true-manchester-salford": 1.05, // Slightly more expensive
    "true-nottingham": 0.9,
    "true-sheffield": 0.88,
    "true-swansea": 0.8, // Most affordable
  };

  const newSlots: NewSlot[] = [];

  // First, get all offerings with their business info
  const offeringsWithBusiness = await db
    .selectFrom("offerings")
    .innerJoin("businesses", "offerings.business_id", "businesses.id")
    .select([
      "offerings.id as offering_id",
      "offerings.slug as offering_slug",
      "businesses.slug as business_slug",
    ])
    .execute();

  const offeringMap = new Map(
    offeringsWithBusiness.map((o) => [
      o.offering_id,
      { offeringSlug: o.offering_slug, businessSlug: o.business_slug },
    ]),
  );

  for (const offering of offerings) {
    const offeringData = offeringMap.get(offering.id);
    if (!offeringData) continue;

    // Extract room type suffix from slug (e.g., "101-e" -> "e")
    const roomTypeSuffix = offeringData.offeringSlug.split("-")[1] || "e";
    const basePrice = roomTypePricing[roomTypeSuffix] || roomTypePricing.e;
    const cityMultiplier = cityMultipliers[offeringData.businessSlug] || 1.0;

    // Calculate final price with city multiplier
    const finalPrice = Math.round(basePrice * cityMultiplier);

    for (const date of rrule.all()) {
      newSlots.push({
        offering_id: offering.id,
        start: date,
        duration: 44 * 7 * 24 * 60, // 44 weeks in minutes
        price: finalPrice,
        capacity: 1,
      });
    }
  }

  return await db.insertInto("slots").values(newSlots).returningAll().execute();
}
