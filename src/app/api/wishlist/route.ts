import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { wishlist } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const DEMO_USER_ID = 'demo-user-id';

export async function GET(req: Request) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");
    if (!userId || userId === DEMO_USER_ID) return NextResponse.json([]);

    const items = await db.select().from(wishlist).where(eq(wishlist.userId, userId));

    return NextResponse.json(
      items.map(i => ({
        id: i.id,
        userId: i.userId,
        productId: i.productId,
        addedAt: i.addedAt ?? new Date(),
      }))
    );
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await db.select().from(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));

    if (existing.length === 0) {
      await db.insert(wishlist).values({ id: uuidv4(), userId, productId, addedAt: new Date() });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, productId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    if (productId) {
      await db.delete(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    } else {
      await db.delete(wishlist).where(eq(wishlist.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist DELETE Error:", error);
    return NextResponse.json({ error: "Failed to remove/clear wishlist" }, { status: 500 });
  }
}
