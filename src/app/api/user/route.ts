import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) return NextResponse.json({ error: "User ID or Email required" }, { status: 400 });

    const result = id
      ? await db.select().from(users).where(eq(users.id, id))
      : await db.select().from(users).where(eq(users.email, email!));

    if (!result.length) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("User GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create user
export async function POST(req: Request) {
  try {
    const { id, name, email, clerkId = "" } = await req.json(); // ✅ clerkId included
    if (!id || !email) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    await db.insert(users).values({ id, name, email, clerkId, createdAt: new Date() }); // ✅ Date
    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("User POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update user
export async function PUT(req: Request) {
  try {
    const { id, name, email } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    await db.update(users).set({ name, email }).where(eq(users.id, id));
    return NextResponse.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("User PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("User DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
