import { NextResponse } from 'next/server';
import { db } from '@/db';
import { cart_items } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json([], { status: 401 });

    const items = await db.select().from(cart_items).where(eq(cart_items.userId, userId));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Cart GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, name, price, imageUrl, size, color, quantity } = await req.json();

    if (!productId || !name || !price || !imageUrl || !size || !color) 
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const intPrice = typeof price === 'string' ? parseInt(price, 10) : price;

    const existing = await db.select().from(cart_items).where(
      and(
        eq(cart_items.userId, userId),
        eq(cart_items.productId, productId),
        eq(cart_items.size, size),
        eq(cart_items.color, color)
      )
    );

    if (existing.length > 0) {
      await db.update(cart_items).set({ quantity: existing[0].quantity + (quantity || 1) }).where(eq(cart_items.id, existing[0].id));
    } else {
      await db.insert(cart_items).values({
        id: uuidv4(),
        userId,
        productId,
        name,
        price: intPrice,
        imageUrl,
        size,
        color,
        quantity: quantity || 1,
        addedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart POST Error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, size, color, delta } = await req.json();
    if (!productId || !size || !color || delta === undefined)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const items = await db.select().from(cart_items).where(
      and(
        eq(cart_items.userId, userId),
        eq(cart_items.productId, productId),
        eq(cart_items.size, size),
        eq(cart_items.color, color)
      )
    );

    if (items.length === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    const newQuantity = items[0].quantity + delta;
    if (newQuantity <= 0) await db.delete(cart_items).where(eq(cart_items.id, items[0].id));
    else await db.update(cart_items).set({ quantity: newQuantity }).where(eq(cart_items.id, items[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, size, color } = await req.json();

    if (productId && size && color) {
      await db.delete(cart_items).where(
        and(
          eq(cart_items.userId, userId),
          eq(cart_items.productId, productId),
          eq(cart_items.size, size),
          eq(cart_items.color, color)
        )
      );
    } else {
      await db.delete(cart_items).where(eq(cart_items.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete cart items' }, { status: 500 });
  }
}
