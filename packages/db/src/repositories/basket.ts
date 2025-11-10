import { db } from "@repo/db/database";
import type {
  Basket,
  BasketAddOn,
  BasketSlot,
  NewBasket,
  NewBasketAddOn,
  NewBasketSlot,
} from "@repo/db/types";

export async function findBasketById(id: number): Promise<Basket | undefined> {
  return await db
    .selectFrom("baskets")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findBasketWithItems(
  basketId: number,
): Promise<
  (Basket & { slots: BasketSlot[]; addOns: BasketAddOn[] }) | undefined
> {
  const basket = await findBasketById(basketId);
  if (!basket) return undefined;

  const slots = await findBasketSlots(basketId);
  const addOns = await findBasketAddOns(basketId);

  return { ...basket, slots, addOns };
}

export async function findBasketSlots(basketId: number): Promise<BasketSlot[]> {
  return await db
    .selectFrom("basket_slots")
    .where("basket_id", "=", basketId)
    .selectAll()
    .execute();
}

export async function findBasketAddOns(
  basketId: number,
): Promise<BasketAddOn[]> {
  return await db
    .selectFrom("basket_add_ons")
    .where("basket_id", "=", basketId)
    .selectAll()
    .execute();
}

export async function createBasket(basket: NewBasket): Promise<Basket> {
  return await db
    .insertInto("baskets")
    .values(basket)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function addSlotToBasket(
  basketSlot: NewBasketSlot,
): Promise<BasketSlot> {
  return await db
    .insertInto("basket_slots")
    .values(basketSlot)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function addAddOnToBasket(
  basketAddOn: NewBasketAddOn,
): Promise<BasketAddOn> {
  return await db
    .insertInto("basket_add_ons")
    .values(basketAddOn)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function removeSlotFromBasket(
  basketId: number,
  slotId: number,
): Promise<BasketSlot | undefined> {
  return await db
    .deleteFrom("basket_slots")
    .where("basket_id", "=", basketId)
    .where("slot_id", "=", slotId)
    .returningAll()
    .executeTakeFirst();
}

export async function removeAddOnFromBasket(
  basketId: number,
  addOnId: number,
): Promise<BasketAddOn | undefined> {
  return await db
    .deleteFrom("basket_add_ons")
    .where("basket_id", "=", basketId)
    .where("add_on_id", "=", addOnId)
    .returningAll()
    .executeTakeFirst();
}

export async function clearBasket(basketId: number): Promise<void> {
  await db
    .deleteFrom("basket_slots")
    .where("basket_id", "=", basketId)
    .execute();
  await db
    .deleteFrom("basket_add_ons")
    .where("basket_id", "=", basketId)
    .execute();
}
