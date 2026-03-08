import { db } from "../database.ts";
import type {
  AddOn,
  Business,
  NewAddOn,
  NewSlot,
  Offering,
  Slot,
} from "../types.ts";
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
      slug: "the-big-london-bake",
      name: "The Big London Bake",
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
        name: "The Big London Bake East",
        slug: "the-big-london-bake-east",
        description:
          "Located next to Haggerston Overground station, The Big London Bake East features a beautiful 12-station baking tent, a cake-inspired bar with delicious cocktails and food, a heated drinks deck and beer garden, plus a private hospitality suite for parties and presentations. Challenge your friends at this award-winning bake off with 90 minutes to bake, decorate and crown a winning pair!",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 1,
      },
      {
        business_id: business.id,
        name: "The Big London Bake South",
        slug: "the-big-london-bake-south",
        description:
          "Located at 38 Tooting High Street in the rear garden of The Castle pub, The Big London Bake South offers a beautiful 12-station baking tent along with food, delicious cocktails and private event space. Challenge your friends at South London's award-winning bake off with 90 minutes to bake, decorate and crown a winning pair!",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 1,
      },
      {
        business_id: business.id,
        name: "The Big Birmingham Bake",
        slug: "the-big-birmingham-bake",
        description:
          "Located in Digbeth, about a 15-minute walk from Birmingham New Street station, The Big Birmingham Bake features a huge tent filled with 12 fully kitted-out workstations, each with an oven, fancy mixers, and all the utensils you need. Take part in Birmingham's award-winning bake off with 90 minutes to bake, decorate and crown a winning pair!",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 1,
      },
      {
        business_id: business.id,
        name: "The Big Manchester Bake",
        slug: "the-big-manchester-bake",
        description:
          "Located at Four New Bailey, just a stone's throw from Spinningfields, The Big Manchester Bake features a fully kitted-out baking marquee with 12 stations, plus a luxury cake-inspired cocktail bar you enter through a fridge door! The venue pays homage to trail-blazing British TV chefs of the 1950s and 1960s. Take part in Manchester's award-winning bake off with 90 minutes to bake, decorate and crown a winning pair!",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 1,
      },
      {
        business_id: business.id,
        name: "The Big Liverpool Bake",
        slug: "the-big-liverpool-bake",
        description:
          "Located at 60 Old Hall Street in Liverpool city centre, The Big Liverpool Bake features a baking marquee and cake-inspired cocktail bar. Mornings begin with a cosy café and coffee shop, while evenings transform into a lively cocktail bar. Take part in Liverpool's award-winning bake off with 90 minutes to bake, decorate and crown a winning pair!",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
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
      name: "The Sweeter Experience",
      description:
        "Upgrade to Sweeter Experience. Includes everything in The Classic Ticket, plus: House Cocktail or Prosecco on arrival (non alcoholic & soft available). Limited Edition Big Bakes souvenir pin for each baker.",
      price: 9_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "The Ultimate Baker",
      description:
        "Upgrade to Ultimate Baker. Includes everything in The Classic Ticket and The Sweeter Experience, plus: Luxury Gift Box with Rose Gold Cake slice & bakers hat.",
      price: 17_00,
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
  const threeMonthsFromNow = new Date(now);
  threeMonthsFromNow.setMonth(now.getMonth() + 3);

  const rrule = new RRule({
    freq: RRule.DAILY,
    dtstart: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    ),
    until: threeMonthsFromNow,
  });

  const slotConfig = [
    { hour: 10, minute: 0, price: 49_99 },
    { hour: 12, minute: 30, price: 62_99 },
    { hour: 15, minute: 0, price: 62_99 },
    { hour: 17, minute: 30, price: 59_99 },
    { hour: 20, minute: 0, price: 49_99 },
  ];

  const newSlots: NewSlot[] = [];
  for (const offering of offerings) {
    for (const date of rrule.all()) {
      for (const config of slotConfig) {
        const slotStart = new Date(date);
        slotStart.setHours(config.hour, config.minute, 0, 0);

        newSlots.push({
          offering_id: offering.id,
          start: slotStart,
          duration: 90,
          price: config.price,
          capacity: 25,
        });
      }
    }
  }

  return await db()
    .insertInto("slots")
    .values(newSlots)
    .returningAll()
    .execute();
}
