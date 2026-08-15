// src/app/the-pack/page.tsx

"use client";

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, TrendingUp, Zap, Gift, UserCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Data for the Ranks System
const ranks = [
    {
        name: "The Cub 🐾",
        level: "Level 1",
        desc: "The newest members of the pack. Just starting the hunt.",
        perk: "Access to member-only drops.",
        req: "Join the Pack (Sign Up)",
        color: "text-gray-400"
    },
    {
        name: "The Wolf 🌙",
        level: "Level 2",
        desc: "Proven engagement and loyalty. Recognized for commitment.",
        perk: "5% loyalty discount on all future purchases.",
        req: "Spend ₹15,000 / Refer 3 new members.",
        color: "text-blue-400"
    },
    {
        name: "The Alpha 🐺",
        level: "Level 3",
        desc: "The leaders of the movement. Influence the direction of new drops.",
        perk: "Exclusive pre-release access (24 hours before Level 2).",
        req: "Spend ₹50,000 / VIP Invitation.",
        color: "text-red-500"
    },
    {
        name: "The Legend 🔥",
        level: "Level MAX",
        desc: "Reserved for pioneers of the culture.",
        perk: "Free custom 1-of-1 piece annually & lifetime discounts.",
        req: "Invite Only / Top 0.1% Community Score.",
        color: "text-yellow-400"
    }
];

export default function ThePackPage() {
    const darkRed = "#b91c1c";

    return (
        <>
            <Header />
            <div className="bg-black text-white pt-24 pb-16 font-inter min-h-screen">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* 1. HERO SECTION */}
                    <div className="text-center mb-16 pt-12 pb-12 border-b border-gray-800">
                        <h1 className="text-7xl md:text-8xl font-anton uppercase font-extrabold tracking-tight text-white mb-4">
                            The Pack Runs Together
                        </h1>
                        <p className="text-2xl font-bold text-red-500 mb-6">
                            Untamed. United. Unstoppable.
                        </p>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                            Join the community of wolves shaping the future of streetwear culture. Belong to a movement, not just a brand.
                        </p>
                    </div>

                    {/* 2. WHAT IS THE PACK */}
                    <section className="py-12 max-w-4xl mx-auto">
                        <h2 className="text-4xl font-anton uppercase mb-6 text-red-500 border-b border-gray-700 pb-3">
                            What is The Pack?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <Shield className="h-8 w-8 text-white mx-auto" />
                                <h3 className="font-bold text-xl uppercase">Unity</h3>
                                <p className="text-gray-400 text-sm">A bond forged by style. Wear your allegiance.</p>
                            </div>
                            <div className="space-y-3">
                                <Zap className="h-8 w-8 text-white mx-auto" />
                                <h3 className="font-bold text-xl uppercase">The Hunt</h3>
                                <p className="text-gray-400 text-sm">Be the first to claim exclusive, limited edition drops.</p>
                            </div>
                            <div className="space-y-3">
                                <TrendingUp className="h-8 w-8 text-white mx-auto" />
                                <h3 className="font-bold text-xl uppercase">Culture</h3>
                                <p className="text-gray-400 text-sm">Influence the direction of the brand and design.</p>
                            </div>
                        </div>
                    </section>

                    <Separator className="my-16 bg-gray-700" />
                    
                    {/* 3. RANKS SYSTEM */}
                    <section className="py-12">
                        <h2 className="text-4xl font-anton uppercase mb-10 text-white text-center">
                            Ascend the Ranks
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {ranks.map((rank, index) => (
                                <div 
                                    key={rank.name} 
                                    className={`p-6 border border-gray-700 rounded-xl shadow-lg space-y-4 transition-all duration-300 
                                      ${index >= 2 ? 'bg-red-900/10 border-red-700' : 'bg-gray-900'}`}
                                >
                                    <h3 className={`text-2xl font-anton uppercase ${rank.color}`}>
                                        {rank.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">{rank.desc}</p>
                                    <div className="pt-2 border-t border-gray-700 space-y-1">
                                        <p className="text-xs font-semibold text-gray-300">Perk:</p>
                                        <p className="font-bold text-white">{rank.perk}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-gray-300">Requirements:</p>
                                        <p className="text-red-400 font-medium">{rank.req}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Separator className="my-16 bg-gray-700" />

                    {/* 4. FINAL CALL TO ACTION */}
                    <section className="text-center py-12">
                        <h2 className="text-5xl font-anton uppercase mb-4">
                            Ready to Join the Hunt?
                        </h2>
                        <p className="text-lg text-gray-400 mb-8">
                            Sign up now to unlock early access, rewards, and your place in the pack.
                        </p>
                        {/* CRITICAL FIX: Removed legacyBehavior and passHref */}
                        <Link href="/sign-up">
                            <Button
                                className="h-14 px-10 text-white font-montserrat text-xl font-bold uppercase transition-colors duration-300"
                                style={{ backgroundColor: darkRed }}
                            >
                                <UserCheck className="mr-3 h-6 w-6" />
                                Join The Pack
                            </Button>
                        </Link>
                    </section>

                </div>
            </div>
            <Footer />
        </>
    );
}