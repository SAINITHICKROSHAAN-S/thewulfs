// src/components/Footer.tsx

"use client";

import Link from 'next/link';
import { Separator } from "./ui/separator"; // Assuming Separator is imported correctly

export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12">
      <div className="container mx-auto px-4 md:px-0 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Brand Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-oswald uppercase font-bold tracking-widest text-red-600">
              THE WULFS
            </h3>
            <p className="text-sm font-inter text-gray-400">
              Streetwear for the untamed. Join the pack.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons (placeholders) */}
              <a href="#" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.772 1.674 4.92 4.918.058 1.266.068 1.646.068 4.854 0 3.204-.01 3.584-.068 4.85-.148 3.252-1.673 4.772-4.918 4.92-1.266.058-1.646.068-4.854.068-3.204 0-3.584-.01-4.85-.068-3.252-.148-4.772-1.674-4.92-4.918-.058-1.266-.068-1.646-.068-4.854 0-3.204.01-3.584.068-4.85.148-3.252 1.673-4.772 4.918-4.92 1.266-.058 1.646-.068 4.854-.068zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.28-.074 1.688-.074 4.948 0 3.26.016 3.668.074 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.074 4.948.074 3.26 0 3.668-.016 4.948-.074 4.358-.2 6.78-2.618 6.98-6.98.058-1.28.074-1.688.074-4.948 0-3.26-.016-3.668-.074-4.948-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.688-.074-4.948-.074zM12 5.013c-3.834 0-6.938 3.104-6.938 6.938 0 3.83 3.104 6.935 6.938 6.935s6.938-3.105 6.938-6.935c0-3.834-3.104-6.938-6.938-6.938zm0 11.391c-2.43 0-4.402-1.972-4.402-4.401 0-2.43 1.972-4.402 4.402-4.402s4.402 1.972 4.402 4.402c0 2.43-1.972 4.401-4.402 4.401z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.627 0 12-5.373 12-12s-5.373-12-12-12zm-2 16.291v-8.582l8 4.291-8 4.291z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.259 10.999h-4.321c-.042-2.39-2.029-4.22-4.459-4.22h-1.956c-2.222 0-3.953 1.637-3.953 3.965 0 2.33 1.731 3.968 3.953 3.968h1.956c2.428 0 4.417-1.83 4.459-4.22zm-4.459 2.21h-2.124c-1.397 0-2.544-1.147-2.544-2.544 0-1.397 1.147-2.544 2.544-2.544 0 1.397-1.147 2.544-2.544 2.544zM12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.772 1.674 4.92 4.918.058 1.266.068 1.646.068 4.854 0 3.204-.01 3.584-.068 4.85-.148 3.252-1.673 4.772-4.918 4.92-1.266.058-1.646.068-4.854.068-3.204 0-3.584-.01-4.85-.068-3.252-.148-4.772-1.674-4.92-4.918-.058-1.266-.068-1.646-.068-4.854 0-3.204.01-3.584.068-4.85.148-3.252 1.673-4.772 4.918-4.92 1.266-.058 1.646-.068 4.854-.068z" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 font-montserrat text-gray-400">
            <h3 className="text-lg font-bold uppercase text-white">The Pack</h3>
            <Link href="/about" className="hover:text-red-600">
              About
            </Link>
            <Link href="/drops" className="hover:text-red-600">
              Shop
            </Link>
            <Link href="/support" className="hover:text-red-600">
              Support
            </Link>
            {/* --- CRITICAL FIX: ADD THE PACK LINK HERE --- */}
            <Link href="/the-pack" className="hover:text-red-600">
              The Pack 
            </Link>
            
          </div>

          {/* Legal Links */}
          <div className="flex flex-col space-y-2 font-montserrat text-gray-400">
            <h3 className="text-lg font-bold uppercase text-white">Info</h3>
            
            <Link href="/privacy-policy" className="hover:text-red-600">
              Privacy Policy
            </Link>
            
            <Link href="/terms-of-service" className="hover:text-red-600">
              Terms of Service
            </Link>
            
            <Link href="/refund-policy" className="hover:text-red-600">
              Refund Policy
            </Link>
            
            <Link href="/contact" className="hover:text-red-600">
              Contact Us
            </Link>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        
        <div className="text-center text-sm font-inter text-gray-500">
          <p>© 2025 The Wulfs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}