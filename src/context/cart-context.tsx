// --- Inside src/context/cart-context.tsx ---

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 🔑 CRITICAL FIX: Add the optional property 'isMainCart' to the interface.
export interface CartItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  isMainCart?: boolean; // <-- THIS FIX IS VITAL for the Checkout page to work
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, size: string, color: string, delta: number) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Utility function to get item key (must match logic in other cart functions)
const getItemKey = (item: CartItem) => `${item.id}-${item.size}-${item.color}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on mount (optional but common)
  useEffect(() => {
    // Implement persistence logic here if needed
  }, []);

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
        // Logic to check if item already exists (simplified)
        const existingItem = prevItems.find(i => 
            i.id === itemToAdd.id && i.size === itemToAdd.size && i.color === itemToAdd.color
        );

        if (existingItem) {
            return prevItems.map(i =>
                i === existingItem ? { ...i, quantity: i.quantity + itemToAdd.quantity } : i
            );
        } else {
            return [...prevItems, itemToAdd];
        }
    });

    setIsCartOpen(true);
  };
  
  const updateQuantity = (id: string, size: string, color: string, delta: number) => {
    setCartItems(prevItems => {
        return prevItems.map(item => {
            if (item.id === id && item.size === size && item.color === color) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCartItems(prevItems => prevItems.filter(item => 
        !(item.id === id && item.size === size && item.color === color)
    ));
  };


  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        isCartOpen, 
        setIsCartOpen, 
        addToCart, 
        updateQuantity, 
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};