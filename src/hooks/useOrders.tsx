'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/order';

export function useOrders(userId?: number) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setHydrated(true);
      }
    }

    fetchOrders();
  }, [userId]);

  async function createOrder(order: Omit<Order, 'id' | 'userId' | 'date'>) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, userId }),
      });
      if (!res.ok) throw new Error('Failed to create order');
      const newOrder: Order = await res.json();
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      console.error(err);
    }
  }

  return { orders, createOrder, hydrated };
}
