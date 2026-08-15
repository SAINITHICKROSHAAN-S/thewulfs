// src/db/index.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { orders, order_items, wishlist, cart_items, products, users } from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && typeof window === "undefined") {
  console.warn("⚠️ Warning: DATABASE_URL is not defined in environment variables.");
}

const pool = new Pool({
  connectionString: databaseUrl,
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
