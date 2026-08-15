// src/components/AccountLayout.tsx

"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, User, Package, MapPin, Heart, HelpCircle, LogOut } from "lucide-react";

interface AccountLayoutProps {
  children: React.ReactNode;
}

// --- FIX: UPDATED NAVIGATION LINKS ARRAY (Support removed) ---
const navLinks = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  // Removed: { href: "/profile/support", label: "Support/Help", icon: HelpCircle },
];

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const darkRed = "#b91c1c"; // Consistent dark red accent

  // Function to determine if a link is currently active
  const isActive = (href: string) => {
    // Handles /profile (main route) and sub-routes (e.g., /profile/orders)
    const currentSlug = pathname.split('/').pop() || 'profile';
    const linkSlug = href.split('/').pop() || 'profile';
    return currentSlug === linkSlug;
  };

  return (
    // CRITICAL FIX: Add margin-top (pt-20) to clear the fixed header
    <div className="bg-black text-white font-inter pt-20"> 
      <div className="container mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <h1 className="text-5xl font-anton uppercase font-extrabold mb-1 tracking-wider">
            Your Pack Hub
          </h1>
          <p className="text-lg text-gray-400">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Left Sidebar Navigation */}
          <nav className="lg:col-span-1 p-6 bg-gray-900 border border-gray-800 rounded-xl shadow-xl h-fit">
            <h2 className="text-lg font-bold uppercase mb-4 text-gray-300 border-b border-gray-700 pb-2">
              Sections
            </h2>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const ActiveIcon = link.icon;
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link 
                        href={link.href}
                        className={`flex items-center p-3 rounded-lg font-medium transition-all duration-200 cursor-pointer 
                          ${active 
                            ? `bg-gray-800 text-white shadow-inner border border-[${darkRed}]` 
                            : 'text-gray-300 hover:bg-gray-800'
                          }`}
                      >
                        <ActiveIcon className="h-5 w-5 mr-3" color={active ? darkRed : '#9ca3af'} />
                        {link.label}
                    </Link>
                  </li>
                );
              })}
              
              {/* Sign Out Link */}
              <li>
                <button
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="w-full text-left flex items-center p-3 rounded-lg font-medium transition-all duration-200 text-red-400 hover:bg-red-900/20 mt-4"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Content Area */}
          <main className="lg:col-span-3 p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-xl min-h-[60vh]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};