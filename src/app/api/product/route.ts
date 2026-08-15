import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Products GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, price, imageUrl, description, sizes, color } = await req.json();
    if (!name || !price || !imageUrl || !description)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const newProduct = {
      id: uuidv4(),
      name,
      slug: slugify(name),
      description,
      price,
      imageUrl,
      sizes,
      color,
      createdAt: new Date(),
    };

    await db.insert(products).values(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Products POST Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing product ID" }, { status: 400 });

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
