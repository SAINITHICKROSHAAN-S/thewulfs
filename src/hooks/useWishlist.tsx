'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { WishlistItem } from '@/types/wishlist';

const STORAGE_KEY = 'wolfshop:wishlist:v1';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load wishlist from localStorage', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist wishlist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist wishlist', e);
    }
  }, [items, hydrated]);

  // Fetch wishlist from server
  async function fetchServerWishlist(userId?: number) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data: WishlistItem[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Add a product
  async function add(item: Product, selectedSize = '', selectedColor = '', userId?: number) {
    const newItem: WishlistItem = {
      ...item,
      id: item.id,
      selectedSize,
      selectedColor,
      addedAt: new Date().toISOString(),
      userId,
    };

    setItems((prev) => (prev.find((p) => p.id === item.id) ? prev : [newItem, ...prev]));

    if (userId) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
      } catch (err) {
        console.error('Failed to sync wishlist to server', err);
      }
    }
  }

  // Remove a product
  async function remove(id: number, userId?: number) {
    setItems((prev) => prev.filter((p) => p.id !== id));

    if (userId) {
      try {
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id, userId }),
        });
      } catch (err) {
        console.error('Failed to remove wishlist item from server', err);
      }
    }
  }

  // Clear the wishlist
  function clear() {
    setItems([]);
    try {
      fetch('/api/wishlist', { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  }

  // Toggle a product
  function toggle(item: Product, selectedSize = '', selectedColor = '', userId?: number) {
    if (items.find((p) => p.id === item.id)) remove(item.id, userId);
    else add(item, selectedSize, selectedColor, userId);
  }

  return { items, add, remove, clear, toggle, hydrated, fetchServerWishlist };
}
