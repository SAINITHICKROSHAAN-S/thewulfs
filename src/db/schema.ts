import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * products - single source of product truth
 * Added size and color for variants.
 */
export const products = pgTable("products", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`), // ✅ Auto-generate UUID
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // store in paise (or smallest unit)
  imageUrl: text("image_url").notNull(),
  size: text("size"), // optional variant
  color: text("color"), // optional variant
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * users - minimal user info linked to Clerk
 * Added clerkId for Clerk mapping.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  clerkId: text("clerk_id").notNull(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * addresses - user shipping/billing addresses
 */
export const addresses = pgTable("addresses", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  label: text("label"),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * orders - user orders
 */
export const orders = pgTable("orders", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull(),
  total: integer("total").notNull(),
});

/**
 * order_items - items within an order
 */
export const order_items = pgTable("order_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: text("order_id").references(() => orders.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  size: text("size"),
  color: text("color"),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
});

/**
 * wishlist - user’s saved products
 */
export const wishlist = pgTable("wishlist", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

/**
 * cart_items - items currently in user’s cart
 */
export const cart_items = pgTable("cart_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id).notNull(),
  productId: text("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});
