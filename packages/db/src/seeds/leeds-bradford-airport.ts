import { getDb } from "@repo/db/database";
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
  return await getDb()
    .insertInto("businesses")
    .values({
      slug: "lba",
      name: "Leeds Bradford Airport",
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function seedOfferings(business: Business): Promise<Offering[]> {
  return await getDb()
    .insertInto("offerings")
    .values([
      {
        business_id: business.id,
        name: "Short Stay",
        slug: "short-stay",
        description:
          "## Short Stay - Our most popular product, sells out fast!\n\nPerfect for business travellers and short breaks. Short stay parking offers quick and easy access to the terminal with number plate recognition berriers and spacious parking bays just a short walk away.\n\nThis popular option sell out fast - book early to secure ypuor space\n\n### Directions to our Short Stay car park\n\nPlease note the directions to our Short Stay car park have changed.Arriving from A658:\n\nPlease proceed along Whitehouse lane (with the terminal building on your right hand side) the road veers to the right, please follow the signs for the Short Stay car park. Turn to the right and the Short Stay car park entry is immediately on your left hand side.Arriving from Scotland Lane / Dean Lane: Please proceed along Whitehouse lane past the Travelodge hotel (on your right), you will approach a junction, please turn left. Remain in the left hand lane, the new Short Stay car park entry is immediately on your left hand side. The postcode for the airport is LS19 7TUThe what3words location reference for the car park entrance is thing.cans.target.\n\n### Getting to the terminal\n\nThe Short Stay car park is a short walk to the terminal. You may need to walk up stairs to reach the terminal front depending on where you have parked.\n\n[Directions to the terminal](https://goo.gl/maps/1zyHDnrRGUz)\n\n## Short Stay Pricing\n\n### Pre-book\n\nGuarantee your space at the best price when you pre-book online. Simply enter your time of arrival and return to get your quote and book.\n\n[Pre-book your parking](https://book.leedsbradfordairport.co.uk/book/LBA/Parking)\n\n### Turn up\n\nPassengers can also turn up and park at our Short Stay car park on the day of travel. Spaces are subject to availability so we recommend booking online to guarantee your space.",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 3,
      },
      {
        business_id: business.id,
        name: "Mid Stay",
        slug: "mid-stay",
        description:
          "## Mid Stay - Best of both\n\nA smart choice for travellers looking for the perfect balance of convenience and value. A convenient option within walking distance of the terminal, Mid Stay parking lets you park, fly, and return with no hassle. No waiting, no handing over keys—just a quick 6-9 minute walk back to your car for a smooth getaway.\n\n### Directions to our Mid Stay car park\n\nAs you approach the Airport, please look out for the Mid Stay signage on the approach roads. Directions to the new Mid Stay car park are as follows:\n\nArriving from A658: Please proceed along Whitehouse lane (with the terminal building on your right hand side) the road veers to the right, please continue straight on. As you continue along Whitehouse lane you will see the Travelodge hotel on your left, please look out for the Mid Stay entry signs. The entry road into Mid Stay car park is immediately on your right hand side.\n\nArriving from Scotland Lane / Dean Lane: Please proceed along Whitehouse lane past the Travelodge hotel (on your right), please look out for the Mid Stay entry signs. The entry road into Mid Stay is immediately on your left hand side.\n\nThe postcode for the airport is LS19 7TU\n\nThe what3words location reference for the car park entrance is counts.oath.invite. The exact location of the new entry can be found here: https://what3words.com/counts.oath.invite\n\n## Mid Stay Pricing\n\n### Pre-book\n\nGuarantee your space at the best price when you pre-book online. Simply enter your time of arrival and return to get your quote and book.\n\n[Pre-book your parking](https://book.leedsbradfordairport.co.uk/book/LBA/Parking)\n\n### Turn up\n\nPassengers can also turn up and park at our Mid Stay car park on the day of travel. Spaces are subject to availability so we recommend booking online to guarantee your space.\n\n*1 day minimum charge applies\n\n| Turn up duration | Price |\n|------------------|-------|\n| Up to 1 day | £68.00 |\n\nEach subsequent day or part thereof	£42.00 per day",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 3,
      },
      {
        business_id: business.id,
        name: "Long Stay",
        slug: "long-stay",
        description:
          "## Long stay - Our most affordable option\n\nOur most affordable option, Long Stay parking offers great value, secure on-site airport parking for all durations.\n\nThe frequent shuttle service gets you to and from the Terminal in just 3 minutes, ensuring a smooth and hassle-free journey.\n\n### Directions to our Long Stay car park\n\nFollow the Long Stay car park signs from Whitehouse Lane. Follow the approach road to the mini roundabout where the Long Stay car park can be accessed by taking the 3rd exit on the right.\n\nThe postcode for the car park is LS19 7TU.\n\n### Getting to the terminal\n\nThe Long Stay car park is a 2-minute shuttle ride to the terminal\n\n## Long Stay Pricing\n\n### Pre-book\n\nGuarantee your space at the best price when you pre-book online. Simply enter your time of arrival and return to get your quote and book.\n\n[Pre-book your parking](https://book.leedsbradfordairport.co.uk/book/LBA/Parking)\n\n### Turn up\n\nPassengers can also turn up and park at our Long Stay car park on the day of travel. Spaces are subject to availability so we recommend booking online to guarantee your space.\n\n*1 day minimum charge applies",
        timezone: "Europe/London",
        currency: "GBP",
        add_on_min_selections: 0,
        add_on_max_selections: 3,
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
      name: "Executive Car Wash",
      description:
        "Full valet service - your car will be cleaned inside and out while you're away",
      price: 35_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "EV Charging",
      description:
        "Electric vehicle charging during your stay (includes charging costs)",
      price: 25_00,
      published_at: new Date(),
    });
    newAddOns.push({
      offering_id: offering.id,
      name: "Fast Track Security",
      description: "Skip the queues with Fast Track security pass (per person)",
      price: 6_50,
      published_at: new Date(),
    });
  }

  return await getDb()
    .insertInto("add_ons")
    .values(newAddOns)
    .returningAll()
    .execute();
}

async function seedSlots(offerings: Offering[]): Promise<Slot[]> {
  const now = new Date();
  const sixMonthsFromNow = new Date(now);
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

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
    until: sixMonthsFromNow,
  });

  const configBySlug: Record<
    string,
    { pricePerDay: number; capacity: number }
  > = {
    "short-stay": { pricePerDay: 25_00, capacity: 800 },
    "mid-stay": { pricePerDay: 18_00, capacity: 500 },
    "long-stay": { pricePerDay: 12_00, capacity: 1200 },
  };

  const newSlots: NewSlot[] = [];
  for (const offering of offerings) {
    const config = configBySlug[offering.slug];
    if (!config) {
      throw new Error(`Unknown offering slug: ${offering.slug}`);
    }

    for (const date of rrule.all()) {
      newSlots.push({
        offering_id: offering.id,
        start: date,
        duration: 24 * 60,
        price: config.pricePerDay,
        capacity: config.capacity,
      });
    }
  }

  return await getDb()
    .insertInto("slots")
    .values(newSlots)
    .returningAll()
    .execute();
}
