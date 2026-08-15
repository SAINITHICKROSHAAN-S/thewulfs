'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
}

interface WishlistContextType {
  items: WishlistItem[];
  hydrated: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>; // FIX 1: Added to the interface
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const USER_ID = 'demo-user-id';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist?userId=${USER_ID}`);
        if (!res.ok) throw new Error('Failed to fetch wishlist');

        const data: any[] = await res.json();
        setItems(data.map(i => ({
          id: i.id,
          productId: i.productId,
          addedAt: new Date(i.addedAt),
        })));
      } catch (e) {
        console.error('Wishlist fetch failed:', e);
      } finally {
        setHydrated(true);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId: string) => {
    setItems(prev => {
      if (prev.find(i => i.productId === productId)) return prev;
      // FIX: Use a unique ID for the local item to guarantee React registers the new item addition correctly
      const tempId = crypto.randomUUID(); 
      return [...prev, { id: tempId, productId, addedAt: new Date() }];
    });

    try {
      await fetch(`/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId }),
      });
    } catch (e) {
      console.error('Failed to add to wishlist:', e);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));

    try {
      await fetch(`/api/wishlist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId }),
      });
    } catch (e) {
      console.error('Failed to remove from wishlist:', e);
    }
  };
  
  // Implement clearWishlist
  const clearWishlist = async () => {
    setItems([]);
    try {
      await fetch(`/api/wishlist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        // To clear the entire wishlist, we only pass userId and omit productId
        body: JSON.stringify({ userId: USER_ID }), 
      });
    } catch (e) {
      console.error('Failed to clear wishlist:', e);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(i => i.productId === productId);
  };

  return (
    // Export all functions and state
    <WishlistContext.Provider value={{ items, hydrated, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}