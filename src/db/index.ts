// src/db/index.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { orders, order_items, wishlist, cart_items, products, users } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    orders,
    order_items,
    wishlist,
    cart_items,
    products,
    users,
  },
});
