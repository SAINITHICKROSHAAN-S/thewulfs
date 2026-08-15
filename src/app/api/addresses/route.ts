import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const DEMO_USER_ID = "demo-user-id";

// GET all addresses
export async function GET(req: Request) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId || userId === DEMO_USER_ID) return NextResponse.json([]);

    const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, userId));
    return NextResponse.json(userAddresses);
  } catch (error) {
    console.error("Addresses GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST new address
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, label, street, city, state, zip, country } = body;

    if (!userId || !street || !city || !state || !zip || !country)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const newAddress = {
      id: uuidv4(),
      userId,
      label,
      street,
      city,
      state,
      zip,
      country,
      isDefault: true,
      createdAt: new Date(), // ✅ Date type
    };

    await db.insert(addresses).values(newAddress);
    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Addresses POST Error:", error);
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}

// PATCH update address
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, id, ...updatedFields } = body;

    if (!userId || !id) return NextResponse.json({ error: "Missing userId or address id" }, { status: 400 });

    await db.update(addresses).set(updatedFields).where(and(eq(addresses.userId, userId), eq(addresses.id, id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Addresses PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// DELETE address(es)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, id } = body;
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    if (id) await db.delete(addresses).where(and(eq(addresses.userId, userId), eq(addresses.id, id)));
    else await db.delete(addresses).where(eq(addresses.userId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Addresses DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete address(es)" }, { status: 500 });
  }
}
