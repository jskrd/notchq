import { createAddOn } from "@repo/db/repositories/add-on";
import { createBusiness } from "@repo/db/repositories/business";
import { createOffering } from "@repo/db/repositories/offering";
import { createSlot } from "@repo/db/repositories/slot";

export async function seed(): Promise<void> {
  const business = await createBusiness({
    slug: "the-pooch-park",
    name: "The Pooch Park",
  });

  const offering1 = await createOffering({
    business_id: business.id,
    name: "The Pooch Park",
    slug: "the-pooch-park",
    description:
      "The field lies adjacent to the River Dearne in Denby Dale. It is approx 2 acres in size, mostly tree lined, which offers some protection from the elements and fenced with tall, tensile strength, stock fencing with an underground skirt to prevent dogs from escaping underneath the wire.\n\nThe field is also equipped with a large selection of high spec, recycled plastic dog agility equipment plus many other exciting features to help stimulate your dog both physically and mentally.  Why not come down and give our tennis ball catapults a whirl!\n\nWe have benches throughout the park and a timber shelter with seating to keep you out of the rain - why not take 5 mins to sit and chill whilst enjoying the view with a Costa Coffee in hand from the shop next door, knowing your dog is having the time of their life!\n\nThe Pooch Park is surrounded by land that we own and has been left unoccupied so you can rest assured that you won't come across any other animals whilst you are using the field. Furthermore we only operate one private hire field here to ensure you have the best experience, in a beautiful setting without any distractions.\n\nThe setting of the Pooch Park is simply magical! Whilst the field is conveniently situated in the centre of Denby Dale, it is accessed via a scenic private path from the carpark and across the River Dearne via a new wooden footbridge. The landscape is stunning and the vibe in Pooch Park 1 is calm and relaxing.",
    timezone: "Europe/London",
    currency: "GBP",
    add_on_min_selections: 1,
    add_on_max_selections: 1,
  });

  const offering2 = await createOffering({
    business_id: business.id,
    name: "The Pooch Park 2",
    slug: "the-pooch-park-2",
    description:
      "Our second field also lies adjacent to the River Dearne, just further along the road. It is approx 2 acres in size, tree lined on one side, which offers good protection from the elements. It is fenced with tall, tensile strength, stock fencing with an underground skirt to prevent dogs from escaping underneath the wire.\n\nThis field is great because you are able to drive directly into the field and park on a fairly level, hard surface and unload your pooch straight into the field - no leads required here! The cosy field shelter is next to the car park so it lends itself to people with mobility issues or those with prams or buggies.\n\nPooch Park 2 is a hidden gem! Whilst the field is conveniently situated near the centre of Denby Dale, it feels like you are in the middle of the countryside. The park is tranquil and you are truly hidden away from the hustle and bustle of daily life.",
    timezone: "Europe/London",
    currency: "GBP",
    add_on_min_selections: 1,
    add_on_max_selections: 1,
  });

  const dates = getDates();
  const times = getTimes();

  for (const date of dates) {
    for (const time of times) {
      await createSlot({
        offering_id: offering1.id,
        date,
        time,
        duration: 50,
        price: 0,
        capacity: 1,
        published_at: new Date(),
      });
    }
  }

  for (const offering of [offering1, offering2]) {
    await createAddOn({
      offering_id: offering.id,
      name: "Up to 2 dogs",
      description: `Up to 2 dogs private hire of the field - ${offering.name}`,
      price: 800,
      published_at: new Date(),
    });

    await createAddOn({
      offering_id: offering.id,
      name: "Up to 3 dogs",
      description: `Up to 3 dogs private hire of the field - ${offering.name}`,
      price: 1000,
      published_at: new Date(),
    });

    await createAddOn({
      offering_id: offering.id,
      name: "Up to 4 dogs",
      description: `Up to 4 dogs private hire of the field - ${offering.name}`,
      price: 1200,
      published_at: new Date(),
    });

    await createAddOn({
      offering_id: offering.id,
      name: "Up to 5 dogs",
      description: `Up to 5 dogs private hire of the field - ${offering.name}`,
      price: 1400,
      published_at: new Date(),
    });

    await createAddOn({
      offering_id: offering.id,
      name: "Up to 6 dogs",
      description: `Up to 6 dogs private hire of the field - ${offering.name}`,
      price: 1600,
      published_at: new Date(),
    });
  }
}

function getDates(): Date[] {
  const now = new Date();

  const startDate = new Date(now);
  startDate.setFullYear(now.getFullYear() - 1);

  const endDate = new Date(now);
  endDate.setFullYear(now.getFullYear() + 1);

  const dates: Date[] = [];
  while (startDate <= endDate) {
    dates.push(startDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
}

function getTimes(): string[] {
  const times: string[] = [];
  for (let i = 8; i <= 16; i++) {
    times.push(`${i}:00`);
  }

  return times;
}
