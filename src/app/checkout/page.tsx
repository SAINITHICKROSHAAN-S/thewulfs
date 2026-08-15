// src/app/checkout/page.tsx

"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { CartItem } from '@/context/cart-context';
import { Footer } from '@/components/Footer';
import { MoonWidget } from '@/components/MoonWidget';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CheckoutAddressSection from '@/components/CheckoutAddressSection';

type PaymentMethod = 'card' | 'paypal' | 'cod';

const CheckoutHeader = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-800 bg-black/90 backdrop-blur-md shadow-md sticky top-0 z-30">
      <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <h1 className="text-xl font-oswald uppercase text-white tracking-widest">
          The Hunt Command Center
        </h1>
      </div>
      <div className="w-6 h-6"></div>
    </div>
  );
};

// OrderSummary now accepts the items it should display
const OrderSummary = ({ itemsToDisplay }: { itemsToDisplay: CartItem[] }) => {
  // We use the cart functions on the main cart, but display is based on itemsToDisplay
  const { updateQuantity, removeFromCart } = useCart(); 
  
  const subtotal = useMemo(
    () => itemsToDisplay.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0), 
    [itemsToDisplay]
  );
  
  const shipping = subtotal > 0 ? 10.0 : 0.0;
  const total = subtotal + shipping;
  
  // Determine if we are in a simple, one-item Instant Buy mode
  // We check for isMainCart === false, which is set only via the URL/Instant Buy.
  const isInstantBuyMode = itemsToDisplay.length === 1 && itemsToDisplay[0].isMainCart === false;
  
  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg space-y-4 sticky top-4 z-10">
      <h2 className="text-xl font-oswald uppercase text-white">Order Summary</h2>
      
      {isInstantBuyMode && (
         <div className="text-sm font-anton uppercase text-red-600 border border-red-600/50 p-2 rounded text-center">
           Instant Checkout Mode
         </div>
      )}

      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {itemsToDisplay.map((item: CartItem) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1">
              <p className="text-sm font-montserrat text-white">{item.name}</p>
              <p className="text-xs font-inter text-gray-400">
                Size: {item.size} | Color: {item.color || 'N/A'}
              </p>
            </div>
            
            {/* FIX: Remove Quantity/Remove buttons in Instant Buy Mode */}
            {!isInstantBuyMode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                  className="text-white px-2 rounded hover:text-red-600"
                >
                  -
                </button>
                <span className="text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                  className="text-white px-2 rounded hover:text-red-600"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="text-gray-400 hover:text-red-600 ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Display quantity in Instant Buy Mode */}
            {isInstantBuyMode && (
              <span className="text-sm font-inter text-white mr-4">Qty: 1</span>
            )}

            <p className="text-sm font-inter text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-gray-700" />

      <div className="space-y-2 font-montserrat text-gray-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-white">${shipping.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="bg-red-600" />

      <div className="flex justify-between text-xl font-anton font-bold text-red-600">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, removeFromCart } = useCart();
  
  // New state to hold items we actually display (Instant Buy or Cart)
  const [itemsToCheckout, setItemsToCheckout] = useState<CartItem[]>([]);
  const isCartEmpty = itemsToCheckout.length === 0;

  // FIX: Logic to switch between Instant Buy and main Cart
  useEffect(() => {
    const isInstantBuy = searchParams.get('instantBuy') === 'true';

    if (isInstantBuy) {
        // 🛑 INSTANT BUY MODE: Construct item from URL parameters
        const itemFromUrl: CartItem = {
            id: searchParams.get('id') || '',
            name: searchParams.get('name') || 'Unknown Product',
            price: searchParams.get('price') || '0.00',
            imageUrl: searchParams.get('imageUrl') || '/placeholder.png', 
            size: searchParams.get('size') || 'M',
            color: searchParams.get('color') || 'Black',
            quantity: 1,
            // 🔑 IMPORTANT: Set this flag so the OrderSummary knows its mode
            isMainCart: false 
        };
        setItemsToCheckout([itemFromUrl].filter(item => item.id)); 
        
        // FIX 2: Clean up the URL without using the unsupported 'shallow' option
        router.replace('/checkout', {}); 
    } else {
        // 🌐 STANDARD MODE: Use the items from the main context
        // Ensure standard cart items have the flag set to true (or omit the flag, default is fine)
        setItemsToCheckout(cartItems.map(item => ({ ...item, isMainCart: true })));
    }
  }, [searchParams, cartItems, router]); // Dependency on searchParams ensures update on Buy Now click

  const PremiumToaster = () => (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1f2937',
          color: '#fff',
          border: `1px solid #dc2626`,
        },
      }}
    />
  );

  const handlePlaceOrder = () => {
    toast.success("Final Command Confirmed! Navigating to Order Confirmation...");
    
    // FIX: Only clear items from the actual persistent cart if we are NOT in Instant Buy Mode
    const isInstantBuy = searchParams.get('instantBuy') === 'true';
    if (!isInstantBuy) {
        // Clear items that were in the main cart before redirect
        cartItems.forEach(item => removeFromCart(item.id, item.size, item.color));
    }
    
    setTimeout(() => router.push('/order-confirmation'), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod) {
      handlePlaceOrder();
    } else {
      toast.error("Please select a payment method.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center relative">
      <PremiumToaster />
      <div className="fixed inset-0 z-0">
        <MoonWidget isVisible={true} />
      </div>

      <div className="w-full bg-black sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-0 max-w-lg">
          <CheckoutHeader />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16 w-full max-w-lg relative z-10">
        {isCartEmpty && (
          <div className="text-center font-montserrat text-gray-400">
            <p className="text-xl mb-4">Your hunt is empty.</p>
            <Link href="/" className="text-red-600 no-underline hover:text-white">
              Continue Shopping
            </Link>
          </div>
        )}

        {!isCartEmpty && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Section */}
            <div className="space-y-6">
              <CheckoutAddressSection />
            </div>

            <Separator className="bg-gray-700" />

            {/* Payment Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-oswald uppercase text-white mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 p-4 rounded-lg border cursor-pointer" onClick={() => setPaymentMethod('card')} >
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'card'} onChange={() => {}} className="h-4 w-4 text-red-600 bg-black border-gray-700 rounded-full focus:ring-red-600" />
                  <span className="text-white font-montserrat">Credit Card</span>
                </label>
                <label className="flex items-center space-x-2 p-4 rounded-lg border cursor-pointer" onClick={() => setPaymentMethod('paypal')}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'paypal'} onChange={() => {}} className="h-4 w-4 text-red-600 bg-black border-gray-700 rounded-full focus:ring-red-600" />
                  <span className="text-white font-montserrat">PayPal</span>
                </label>
                <label className="flex items-center space-x-2 p-4 rounded-lg border cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => {}} className="h-4 w-4 text-red-600 bg-black border-gray-700 rounded-full focus:ring-red-600" />
                  <span className="text-white font-montserrat">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg space-y-4">
                  <Input type="text" placeholder="Card Number" className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-montserrat p-3" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="text" placeholder="MM/YY" className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-montserrat p-3" />
                    <Input type="text" placeholder="CVC" className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-montserrat p-3" />
                  </div>
                  <Input type="text" placeholder="Name on Card" className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-montserrat p-3" />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-montserrat text-lg font-bold uppercase transition-colors duration-300">
              Confirm Final Command
            </Button>
          </form>
        )}

        <div className="mt-8">
          {/* OrderSummary receives the list of items to display */}
          <OrderSummary itemsToDisplay={itemsToCheckout} />
        </div>
      </main>

      <div className="w-full relative z-10">
        <Footer />
      </div>
    </div>
  );
}