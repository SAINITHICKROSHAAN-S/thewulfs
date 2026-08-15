"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <div className="h-24" />
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-anton uppercase font-extrabold mb-4 leading-none">
            WE ARE THE PACK
          </h1>
          <p className="text-md md:text-xl font-oswald max-w-3xl mx-auto text-gray-400">
            Born to hunt. Built to lead.
          </p>
        </section>

        <Separator className="my-16 bg-gray-700" />

        {/* The Story */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-anton uppercase font-extrabold mb-8">
            The Origin of the Wild
          </h2>
          <p className="text-lg md:text-xl font-inter text-gray-300 leading-relaxed mb-6">
            In the shadows of a concrete jungle, we discovered our primal calling. Inspired by the untamed spirit of the wolf, we sought to build a brand that embodies loyalty, strength, and a rebellious soul. The Wulfs is born from the instinct to move as one, a pack bound not by blood, but by a shared ethos.
          </p>
          <p className="text-lg md:text-xl font-inter text-gray-300 leading-relaxed">
            Our streetwear is a testament to this wild spirit—designed for those who challenge the status quo and live on their own terms.
          </p>
        </section>

        <Separator className="my-16 bg-gray-700" />

        {/* The Vision */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-anton uppercase font-extrabold mb-8">
            Our Vision
          </h2>
          <p className="text-lg md:text-xl font-inter text-gray-300 leading-relaxed">
            To build a global pack of untamed individuals. The Wulfs is more than just clothing; it's a culture, a community, and a symbol of exclusivity. We create limited drops that are earned by those who dare to be different. This is our promise: to outfit the fearless, and to lead the way through style and rebellion.
          </p>
        </section>

        <Separator className="my-16 bg-gray-700" />

        {/* The Pack */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-anton uppercase font-extrabold mb-8">
            Become a Wulf
          </h2>
          <p className="text-lg md:text-xl font-inter text-gray-300 leading-relaxed mb-8">
            Joining The Wulfs isn't just about wearing our brand. It's about becoming part of a movement. It's an invitation to a circle of individuals who are loyal, fearless, and always on the hunt.
          </p>
          <Link href="/join-the-pack">
            <Button className="w-full sm:w-auto h-12 bg-red-600 hover:bg-red-700 text-white font-montserrat text-lg font-bold uppercase transition-colors duration-300">
              Join The Pack
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}