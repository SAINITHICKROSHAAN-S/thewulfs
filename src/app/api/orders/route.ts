import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, order_items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const ordersData = await db.select().from(orders).execute();

    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const itemsData = await db
          .select()
          .from(order_items)
          .where(eq(order_items.orderId, order.id)) // ✅ camelCase
          .execute();

        return {
          id: order.id,
          date: order.date ?? "",
          status: order.status ?? "In Progress",
          total: order.total ?? 0,
          items: itemsData.map((item) => ({
            id: Number(item.id),
            productId: item.productId, // ✅ camelCase
            name: item.name ?? "",
            size: item.size ?? "",
            color: item.color ?? "",
            quantity: item.quantity ?? 1,
            price: item.price ?? 0,
            imageUrl: item.imageUrl ?? "/assets/placeholder.png", // ✅ camelCase
          })),
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
