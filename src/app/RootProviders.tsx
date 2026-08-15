'use client'; 

import { ReactNode } from 'react';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/WishListContext';
import { AddressesProvider } from '@/context/AddressesContext';
import { FlyoutCart } from '@/components/FlyoutCart';
import { useClerk } from '@clerk/nextjs'; 
import { Loader2 } from 'lucide-react'; 

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  const { loaded } = useClerk(); 

  // Wait for Clerk to fully initialize before rendering providers
  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        <span className="ml-3 font-bold uppercase">Initializing WULFS Security...</span>
      </div>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <AddressesProvider>
          {children}
          <FlyoutCart /> 
        </AddressesProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
