'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Footer } from "@/components/Footer";
import { CartItem } from "@/context/cart-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Header } from "@/components/Header";
import { MoonWidget } from "@/components/MoonWidget";

// Mock data for related products
const mockRelatedItems = [
  {
    id: 7,
    name: "Desert Howl Tee",
    imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Desert+Howl+Tee",
    price: "$45.00",
  },
  {
    id: 8,
    name: "Night Stalker Joggers",
    imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Night+Stalker+Joggers",
    price: "$85.00",
  },
  {
    id: 9,
    name: "Forest Pack Hoodie",
    imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Forest+Pack+Hoodie",
    price: "$95.00",
  },
];

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const subtotal = useMemo(
    // FIX 1: Convert item.price string to a number using parseFloat() for calculation
    () => cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0),
    [cartItems]
  );
  const shipping = subtotal > 0 ? 0.0 : 0;
  const tax = subtotal > 0 ? 0.0 : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center relative">
      {/* Background widget */}
      <div className="fixed inset-0 z-0">
        <MoonWidget isVisible={true} />
      </div>

      <Header />
      <div className="h-24 hidden md:block" />

      <main className="container mx-auto px-4 py-8 md:py-16 w-full max-w-lg relative z-10">
        <h1 className="text-4xl font-anton uppercase font-extrabold mb-8 text-center md:text-5xl">
          YOUR HUNT BAG
        </h1>
        <p className="text-center text-sm font-montserrat text-gray-400 mb-8">
          The spoils of the hunt await.
        </p>

        {cartItems.length === 0 ? (
          <div className="text-center font-montserrat text-gray-400">
            <p className="text-xl mb-4">Your hunt bag is empty.</p>
            <Link href="/" className="text-red-600 hover:text-white">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            {/* Cart Items */}
            <section className="space-y-6">
              {cartItems.map((item: CartItem) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-oswald font-semibold uppercase text-white mb-1">
                        {item.name}
                      </h2>
                      <p className="text-xs font-inter text-gray-400 mb-1 flex items-center gap-2">
                        <span>Size: {item.size}</span>
                        <span className="flex items-center gap-1">
                          Color: {item.color}
                          <span
                            className="w-3 h-3 rounded-full border border-gray-400"
                            style={{ backgroundColor: item.color }}
                          />
                        </span>
                      </p>
                      {/* FIX 2: Convert item.price string to a number using parseFloat() for display formatting */}
                      <p className="text-md font-inter text-gray-400">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-0 bg-gray-800 rounded-full px-2">
                      <button
                        className="p-2 text-white hover:text-red-600 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, -1)
                        } 
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-inter">
                        {item.quantity}
                      </span>
                      <button
                        className="p-2 text-white hover:text-red-600 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.color, 1)
                        } 
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="p-2 text-gray-500 hover:text-red-600 transition-all duration-200"
                      onClick={() =>
                        removeFromCart(item.id, item.size, item.color)
                      } 
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Total */}
            <section className="p-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg relative z-10">
              <h2 className="text-xl font-oswald uppercase mb-4">THE TOTAL HAUL</h2>
              <div className="space-y-2 font-inter text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Separator className="my-4 bg-gray-700" />
                <div className="flex justify-between text-xl font-montserrat font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Pack Benefits */}
            <section className="relative z-10">
              <h3 className="text-center font-montserrat text-sm text-gray-400 mb-4 uppercase tracking-wide">
                PACK BENEFITS
              </h3>
              <div className="flex justify-around items-center gap-4 text-white">
                <span className="text-sm font-montserrat">Secure Checkout</span>
                <Separator orientation="vertical" className="bg-gray-700 h-6" />
                <span className="text-sm font-montserrat">Easy Returns</span>
                <Separator orientation="vertical" className="bg-gray-700 h-6" />
                <span className="text-sm font-montserrat">Fast Shipping</span>
              </div>
            </section>

            {/* Proceed Button */}
            <div className="relative z-10">
              <Link href="/checkout">
                <Button className="w-full h-14 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-montserrat text-lg font-bold uppercase transition-all duration-300 shadow-lg hover:shadow-2xl">
                  Proceed to Hunt
                </Button>
              </Link>
            </div>

            {/* Related Products Carousel */}
            <section className="space-y-4 relative z-10">
              <h2 className="text-2xl font-oswald uppercase font-extrabold text-center mt-8">
                Complete Your Hunt
              </h2>
              <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent className="-ml-1">
                  {mockRelatedItems.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-1 basis-2/3 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                    >
                      <Link href={`/product/${item.id}`} className="block h-full">
                        <div className="group relative z-10 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 h-full flex flex-col">
                          <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              unoptimized
                            />
                          </div>
                          <div className="p-4 flex flex-col items-center flex-1">
                            <h3 className="text-lg font-oswald font-semibold uppercase text-white mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm font-inter text-gray-400 mb-4">
                              {item.price}
                            </p>
                            <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-montserrat font-bold py-2 px-4 rounded-full text-sm uppercase transition-all duration-300 shadow-md hover:shadow-lg">
                              Shop Now
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>
          </div>
        )}
      </main>

      <div className="w-full relative z-10">
        <Footer />
      </div>
    </div>
  );
}