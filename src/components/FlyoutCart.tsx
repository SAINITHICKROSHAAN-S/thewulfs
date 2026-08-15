'use client';

import { useCart } from "@/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
// 🔑 ADDED: Import usePathname for path detection
import { usePathname } from 'next/navigation'; 
import { useEffect } from 'react'; // Ensure useEffect is imported

export function FlyoutCart() {
  const { isLoaded } = useUser(); 
  const { cartItems, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  // 🔑 ADDED: Get the current path
  const pathname = usePathname();

  // 🔑 FIX: Automatic Cart Closure on Navigation
  useEffect(() => {
    // This effect runs every time the pathname changes.
    // If the cart is open, close it immediately upon navigating to a new page.
    if (isCartOpen) {
      setIsCartOpen(false);
    }
  }, [pathname]); // Depend on pathname

  if (!isLoaded) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity, 
    0
  );

  // Function to close the cart when internal links are clicked (redundant now, but cleaner UX)
  const handleNavigate = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Full-page blur effect */}
      <div className={`transition-all duration-300 ${isCartOpen ? "blur-sm pointer-events-none" : ""}`}>
        {/* Main page content goes inside this wrapper */}
      </div>

      {/* Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isCartOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Flyover Mini-Cart Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-full max-w-sm border-l border-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } bg-black bg-opacity-90 backdrop-blur-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-oswald uppercase font-bold text-white">
              Your Hunt ({cartItems.length})
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cartItems.length === 0 ? (
              <div className="flex flex-col justify-center items-center mt-20 space-y-4 text-gray-400">
                <p>Your cart is empty.</p>
                <Link href="/drops" onClick={handleNavigate}>
                  <Button className="w-full max-w-xs h-12 border border-white text-white font-montserrat font-bold uppercase text-center transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item: CartItem) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-md font-montserrat font-semibold text-white">{item.name}</h3>
                    <p className="text-sm font-inter text-gray-400">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm font-inter text-gray-400">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                      className="p-1 text-white hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5.25 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm font-inter text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                      className="p-1 text-white hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M12 5.25a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between font-montserrat text-white text-lg font-semibold mb-4">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Link href="/cart" onClick={handleNavigate}>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-montserrat text-lg font-bold uppercase mb-2 transition-transform duration-200 hover:scale-105">
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={handleNavigate}>
                <Button className="w-full h-12 bg-white text-black border border-white hover:bg-black hover:text-white font-montserrat text-lg font-bold uppercase transition-all duration-300 hover:scale-105">
                  Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}