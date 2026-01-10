import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  add_ons: AddOnTable;
  basket_add_ons: BasketAddOnTable;
  basket_slots: BasketSlotTable;
  baskets: BasketTable;
  bookings: BookingTable;
  business_users: BusinessUserTable;
  businesses: BusinessTable;
  offerings: OfferingTable;
  payments: PaymentTable;
  slots: SlotTable;
  users: UserTable;
}

export interface AddOnTable {
  id: Generated<number>;
  offering_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number | null;
  published_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
  deleted_at: ColumnType<Date | null, string | undefined, never>;
}
export type AddOn = Selectable<AddOnTable>;
export type NewAddOn = Insertable<AddOnTable>;
export type AddOnUpdate = Updateable<AddOnTable>;

export interface BasketTable {
  id: Generated<number>;
  user_id: number | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type Basket = Selectable<BasketTable>;
export type NewBasket = Insertable<BasketTable>;
export type BasketUpdate = Updateable<BasketTable>;

export interface BasketAddOnTable {
  basket_id: number;
  add_on_id: number;
  price: number;
  quantity: number;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type BasketAddOn = Selectable<BasketAddOnTable>;
export type NewBasketAddOn = Insertable<BasketAddOnTable>;
export type BasketAddOnUpdate = Updateable<BasketAddOnTable>;

export interface BasketSlotTable {
  basket_id: number;
  slot_id: number;
  price: number;
  quantity: number;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type BasketSlot = Selectable<BasketSlotTable>;
export type NewBasketSlot = Insertable<BasketSlotTable>;
export type BasketSlotUpdate = Updateable<BasketSlotTable>;

export interface BookingTable {
  id: Generated<number>;
  reference: string;
  basket_id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type Booking = Selectable<BookingTable>;
export type NewBooking = Insertable<BookingTable>;
export type BookingUpdate = Updateable<BookingTable>;

export interface BusinessTable {
  id: Generated<number>;
  slug: string;
  name: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type Business = Selectable<BusinessTable>;
export type NewBusiness = Insertable<BusinessTable>;
export type BusinessUpdate = Updateable<BusinessTable>;

export interface BusinessUserTable {
  business_id: number;
  user_id: number;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type BusinessUser = Selectable<BusinessUserTable>;
export type NewBusinessUser = Insertable<BusinessUserTable>;
export type BusinessUserUpdate = Updateable<BusinessUserTable>;

export interface OfferingTable {
  id: Generated<number>;
  business_id: number;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  image_accent_color: string | null;
  timezone: string;
  currency: string;
  add_on_min_selections: ColumnType<number, number | undefined, number>;
  add_on_max_selections: number | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
  deleted_at: ColumnType<Date, string | undefined, never>;
}
export type Offering = Selectable<OfferingTable>;
export type NewOffering = Insertable<OfferingTable>;
export type OfferingUpdate = Updateable<OfferingTable>;

export interface PaymentTable {
  id: Generated<number>;
  booking_id: number;
  stripe_payment_intent_id: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  last4: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type Payment = Selectable<PaymentTable>;
export type NewPayment = Insertable<PaymentTable>;
export type PaymentUpdate = Updateable<PaymentTable>;

export interface SlotTable {
  id: Generated<number>;
  offering_id: number;
  start: Date;
  duration: number;
  price: number;
  capacity: number | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type Slot = Selectable<SlotTable>;
export type NewSlot = Insertable<SlotTable>;
export type SlotUpdate = Updateable<SlotTable>;

export interface UserTable {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  email_verified_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
