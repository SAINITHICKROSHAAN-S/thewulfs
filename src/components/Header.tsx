// components/Header.tsx

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/MobileNav";
import { Search, ShoppingCart } from "lucide-react"; // 🔑 REMOVED: Loader2
import { useCart } from "@/context/cart-context";
import CustomUserDropdown from "@/components/CustomUserDropdown"; 
// 🔑 REMOVED: import { useUser } from "@clerk/nextjs"; 

export function Header() {
  // 🔑 REMOVED: const { isLoaded } = useUser();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setIsCartOpen } = useCart();

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // 🔑 REMOVED: UserAuthControl helper function. We use CustomUserDropdown directly now.
  // CustomUserDropdown handles its own loading state.

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] text-white shadow-md"
      style={{ backgroundColor: "hsl(0, 0%, 0%)" }}
    >
      <div className="mx-auto py-3 flex items-center justify-between px-4">
        <MobileNav />
        
        {/* Logo and Brand Name with Home Tooltip */}
        <Link href="/" className="flex items-center space-x-4 group relative">
          <Image 
            src="/assets/logo.png"
            alt="The Wulfs Logo" 
            width={48}
            height={48}
          />
          <div className="text-4xl font-bold uppercase tracking-widest text-white">
            THE WULFS
          </div>
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-gray-700 text-white text-xs rounded-lg py-1 px-2 pointer-events-none">
            Home
          </span>
        </Link>

        {/* Right-Side Icons: Search, Cart, Auth Button */}
        <div className="flex items-center space-x-4">
          
          {/* Search bar with hover effect (Omitted for brevity) */}
          <div className="relative flex items-center group transition-all duration-300 ease-in-out">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white placeholder-gray-400 border-gray-700 rounded-full p-2
                w-0 opacity-0 group-hover:w-48 group-hover:opacity-100
                transition-all duration-300 ease-in-out"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              onClick={handleSearchClick}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart Icon with Cart Tooltip (Omitted for brevity) */}
          <div className="relative group">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-gray-800"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <span className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-gray-700 text-white text-xs rounded-lg py-1 px-2 pointer-events-none left-1/2 -translate-x-1/2 whitespace-nowrap">
              Cart
            </span>
          </div>

          {/* USER AUTH ICON / LOGIN BUTTON */}
          <CustomUserDropdown />
        </div>
      </div>
    </header>
  );
}