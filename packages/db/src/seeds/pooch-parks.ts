import { db } from "@repo/db/database";
import type {
  AddOn,
  Business,
  NewAddOn,
  NewSlot,
  Offering,
  Slot,
} from "@repo/db/types";
import { RRule } from "rrule";

export async function seed(): Promise<void> {
  const business = await seedBusiness();
  const offerings = await seedOfferings(business);
  await seedAddOns(offerings);
  await seedSlots(offerings);
}

async function seedBusiness(): Promise<Business> {
  return await db()
    .insertInto("businesses")
    .values({
      slug: "pooch-parks",
      name: "Pooch Parks, Denby Dale",
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function seedOfferings(business: Business): Promise<Offering[]> {
  return await db()
    .insertInto("offerings")
    .values([
      {
        business_id: business.id,
        name: "The Pooch Park",
        slug: "the-pooch-park",
        description:
          "The field lies adjacent to the River Dearne in Denby Dale. It is approx 2 acres in size, mostly tree lined, which offers some protection from the elements and fenced with tall, tensile strength, stock fencing with an underground skirt to prevent dogs from escaping underneath the wire.\n\nThe field is also equipped with a large selection of high spec, recycled plastic dog agility equipment plus many other exciting features to help stimulate your dog both physically and mentally.  Why not come down and give our tennis ball catapults a whirl!\n\nWe have benches throughout the park and a timber shelter with seating to keep you out of the rain - why not take 5 mins to sit and chill whilst enjoying the view with a Costa Coffee in hand from the shop next door, knowing your dog is having the time of their life!\n\nThe Pooch Park is surrounded by land that we own and has been left unoccupied so you can rest assured that you won't come across any other animals whilst you are using the field. Furthermore we only operate one private hire field here to ensure you have the best experience, in a beautiful setting without any distractions.\n\nThe setting of the Pooch Park is simply magical! Whilst the field is conveniently situated in the centre of Denby Dale, it is accessed via a scenic private path from the carpark and across the River Dearne via a new wooden footbridge. The landscape is stunning and the vibe in Pooch Park 1 is calm and relaxing.",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 1,
        add_on_max_selections: 1,
      },
      {
        business_id: business.id,
        name: "The Pooch Park 2",
        slug: "the-pooch-park-2",
        description:
          "Our second field also lies adjacent to the River Dearne, just further along the road. It is approx 2 acres in size, tree lined on one side, which offers good protection from the elements. It is fenced with tall, tensile strength, stock fencing with an underground skirt to prevent dogs from escaping underneath the wire.\n\nThis field is great because you are able to drive directly into the field and park on a fairly level, hard surface and unload your pooch straight into the field - no leads required here! The cosy field shelter is next to the car park so it lends itself to people with mobility issues or those with prams or buggies.\n\nPooch Park 2 is a hidden gem! Whilst the field is conveniently situated near the centre of Denby Dale, it feels like you are in the middle of the countryside. The park is tranquil and you are truly hidden away from the hustle and bustle of daily life.",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 1,
        add_on_max_selections: 1,
      },
    ])
    .returningAll()
    .execute();
}

async function seedAddOns(offerings: Offering[]): Promise<AddOn[]> {
  const newAddOns: NewAddOn[] = [];
  for (const offering of offerings) {
    newAddOns.push({
      offering_id: offering.id,
      name: "Up to 2 dogs",
      description: `Up to 2 dogs private hire of the field - ${offering.name}`,
      price: 8_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "Up to 3 dogs",
      description: `Up to 3 dogs private hire of the field - ${offering.name}`,
      price: 10_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "Up to 4 dogs",
      description: `Up to 4 dogs private hire of the field - ${offering.name}`,
      price: 12_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "Up to 5 dogs",
      description: `Up to 5 dogs private hire of the field - ${offering.name}`,
      price: 14_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "Up to 6 dogs",
      description: `Up to 6 dogs private hire of the field - ${offering.name}`,
      price: 16_00,
      published_at: new Date(),
    });
  }

  return await db()
    .insertInto("add_ons")
    .values(newAddOns)
    .returningAll()
    .execute();
}

async function seedSlots(offerings: Offering[]): Promise<Slot[]> {
  const now = new Date();
  const oneMonthFromNow = new Date(now);
  oneMonthFromNow.setMonth(now.getMonth() + 1);

  const rrule = new RRule({
    freq: RRule.HOURLY,
    interval: 1,
    byhour: [8, 9, 10, 11, 12, 13, 14, 15, 16],
    dtstart: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      8,
      0,
      0,
    ),
    until: oneMonthFromNow,
  });

  const basePriceBySlug: Record<string, { weekday: number; weekend: number }> =
    {
      "the-pooch-park": { weekday: 7_00, weekend: 9_00 },
      "the-pooch-park-2": { weekday: 6_00, weekend: 8_00 },
    };

  const newSlots: NewSlot[] = [];
  for (const offering of offerings) {
    const pricing = basePriceBySlug[offering.slug];
    if (!pricing) {
      throw new Error(`Unknown offering slug: ${offering.slug}`);
    }

    for (const date of rrule.all()) {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const basePrice = isWeekend ? pricing.weekend : pricing.weekday;

      newSlots.push({
        offering_id: offering.id,
        start: date,
        duration: 50,
        price: basePrice,
        capacity: 1,
      });
    }
  }

  return await db()
    .insertInto("slots")
    .values(newSlots)
    .returningAll()
    .execute();
}
