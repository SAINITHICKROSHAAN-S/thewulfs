'use client';

import { useEffect, useState } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

const STORAGE_KEY = 'wolfshop:cart:v1';

export function useCart(userId?: number) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items, hydrated]);

  // Fetch cart from server and merge
  async function fetchServerCart() {
    if (!userId) return;
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch cart');
      const serverData: CartItem[] = await res.json();

      const merged: CartItem[] = [...items];
      serverData.forEach((serverItem) => {
        const idx = merged.findIndex(
          (localItem) =>
            localItem.productId === serverItem.productId &&
            localItem.size === serverItem.size &&
            localItem.color === serverItem.color
        );
        if (idx >= 0) {
          merged[idx].quantity += serverItem.quantity;
        } else {
          merged.push(serverItem);
        }
      });

      setItems(merged);

      merged.forEach((item) => syncToServer(item));
    } catch (err) {
      console.error(err);
    }
  }

  async function add(item: Product, quantity = 1, size = '', color = '') {
    const cartItem: CartItem = {
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price, // number type
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : item.imageUrl.src || '',
      size,
      color,
      quantity,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.productId === item.id && p.size === size && p.color === color
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, cartItem];
    });

    if (userId) await syncToServer(cartItem);
  }

  async function syncToServer(cartItem: CartItem) {
    if (!userId) return;
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cartItem, userId }),
      });
    } catch (err) {
      console.error('Failed to sync cart to server', err);
    }
  }

  function updateQuantity(productId: number, delta: number, size = '', color = '') {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size && item.color === color) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function remove(productId: number, size = '', color = '') {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  }

  function clear() {
    setItems([]);
  }

  return { items, add, remove, clear, updateQuantity, hydrated, fetchServerCart };
}
