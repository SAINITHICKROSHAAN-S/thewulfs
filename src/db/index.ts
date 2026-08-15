// src/db/index.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { orders, order_items, wishlist, cart_items, products, users } from "./schema";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

if (!databaseUrl && typeof window === "undefined") {
  console.warn("⚠️ Warning: DATABASE_URL, POSTGRES_URL, or POSTGRES_PRISMA_URL is not defined in environment variables.");
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
