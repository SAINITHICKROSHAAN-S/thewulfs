// src/components/CustomUserDropdown.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { User, Package, LogOut, Heart, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // 🔑 CRITICAL FIX: Missing import added here

// --- Define Navigation and Styles ---
const NAV_ITEMS = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export default function CustomUserDropdown() {
    const { user, isSignedIn, isLoaded: isUserLoaded } = useUser();
    const { signOut } = useClerk();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // --- Click Outside to Close ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // FIX: Guard against the loading state here.
    if (!isUserLoaded) {
        return (
            <div className="w-10 h-10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            </div>
        );
    }
    
    // --- Render Signed-In Content ---
    if (isSignedIn) {
        const hoverText = "Profile";
        return (
            <div ref={ref} className="relative group">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-800"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <User className="h-6 w-6" color="#ffffff" />
                </Button>

                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-gray-700 text-white text-xs rounded-lg py-1 px-2 pointer-events-none">
                    {hoverText}
                </span>

                {isOpen && (
                    <div 
                        className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl z-50 transition-opacity duration-150"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="p-4 border-b border-gray-800">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="text-lg font-bold truncate">
                                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>

                        <nav className="space-y-1 p-2">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.href}
                                    className="flex items-center w-full p-3 rounded-lg text-white hover:bg-gray-800 transition-colors text-left"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push(item.href);
                                    }}
                                >
                                    <item.icon className="h-4 w-4 mr-3" color="#ffffff" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="p-2 border-t border-gray-800">
                            <button
                                // FIX: Redirect to current path after sign out.
                                onClick={() => signOut({ redirectUrl: pathname })} 
                                className="w-full text-left flex items-center p-3 rounded-lg text-red-400 font-bold hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="h-5 w-5 mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- Render Signed-Out Content ---
    const hoverText = "Login";
    return (
        <div className="relative group">
            {/* FIX: Link to /login using the imported Link component */}
            <Link href="/login" className="flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-800"
                >
                    <User className="h-6 w-6" color="#ffffff" />
                </Button>
            </Link>
            
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-gray-700 text-white text-xs rounded-lg py-1 px-2 pointer-events-none">
                {hoverText}
            </span>
        </div>
    );
}