'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MoonWidget } from "@/components/MoonWidget";
import { mockProducts, mockPackMembers } from "@/data/mock-data";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// 🔑 REMOVED: import { useUser } from "@clerk/nextjs"; 
// 🔑 REMOVED: import { Loader2 } from "lucide-react"; 

export default function Home() {
  // 🔑 REMOVED: const { isLoaded } = useUser(); 

  const products = mockProducts;
  const mockReviewPhotos = mockPackMembers;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // 🔑 REMOVED: if (!isLoaded) { return ... }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      {/* === ✨ Premium Animated Hero Section === */}
      <section className="relative h-[90vh] flex items-center justify-start overflow-hidden pt-20">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/assets/hero.jpeg"
            alt="Black wolf howling at the blood moon"
            fill
            className="opacity-70 object-cover"
            unoptimized
          />
          {/* Subtle dark overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        </motion.div>

        {/* Hero Text + Buttons */}
        <div className="relative z-10 p-4 max-w-lg mx-auto md:mx-0 md:ml-20">
          {/* Animated heading lines */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  ease: "easeOut",
                  staggerChildren: 0.2,
                },
              },
            }}
            className="text-6xl md:text-8xl font-extrabold uppercase mb-4 leading-none text-left font-anton"
          >
            <motion.span variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
              Wear
            </motion.span>
            <br />
            <motion.span variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
              Your
            </motion.span>
            <br />
            <motion.span
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              //className="text-red-600"
            >
              Wild
            </motion.span>
          </motion.h1>

          {/* Tagline Fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-md md:text-lg mb-8 text-left font-inter text-gray-200"
          >
            Streetwear for the untamed. Join The Pack.
          </motion.p>

          {/* Buttons with slight delay + hover depth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col space-y-4 font-montserrat w-60"
          >
            <Link href="/drops">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                  Shop The Drop
                </Button>
              </motion.div>
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Button
                variant="outline"
                className="w-full text-white bg-white/10 border-white hover:bg-white/20 hover:text-white font-bold py-3 px-8 rounded-full text-lg uppercase transition-all duration-300"
              >
                Join The Pack
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === Rest of your page unchanged === */}

      {/* Blood Moon Drop Section */}
      <section className="py-20 px-4 bg-black text-center">
        <span className="inline-block px-4 py-1 mb-4 rounded-md bg-red-600 text-white uppercase text-xs font-montserrat tracking-wide transform -skew-x-6 shadow-lg">
          Exclusive First Release
        </span>
        <h2 className="text-5xl md:text-6xl font-extrabold uppercase mb-2 font-anton">
          Blood Moon Drop
        </h2>
        <p className="text-md md:text-xl max-w-2xl mx-auto font-oswald mb-2">
          The first release of The Wulfs. Born from the streets. Built for the bold.
        </p>
        <p className="text-sm font-inter text-gray-400 uppercase mb-12">
          Wear your wild.
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="group relative rounded-2xl overflow-hidden border border-gray-800 hover:border-red-700 transition-all duration-500 bg-neutral-950 cursor-pointer">
                <div className="relative w-full h-[400px] overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold font-montserrat tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 font-inter">
                    {product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Who Are The Wulfs Section */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen bg-black overflow-hidden py-20 flex items-center justify-start text-left"
      >
        <MoonWidget isVisible={isVisible} />
        <div
          className={`absolute inset-0 flex flex-col items-start justify-center z-10 p-4 max-w-lg mx-auto md:mx-0 md:ml-20 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 font-oswald">
            Who Are The Wulfs?
          </h2>
          <div className="w-20 h-1 bg-red-600 mb-8"></div>
          <p className="text-md md:text-lg max-w-2xl mb-8 font-inter">
            We are not just a brand. We are a Pack. Born from wolf culture – loyalty,
            strength, wild spirit. Our streetwear is made for those who move fearless.
          </p>
          <Link href="/about">
            <Button
              variant="outline"
              className="text-white bg-white/10 border-white hover:bg-white/20 hover:text-white font-bold py-2 px-6 rounded-full uppercase transition-transform duration-300 hover:scale-105 font-montserrat"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* The Pack In Action Section */}
      <section className="py-20 px-4 bg-black text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 font-oswald">
          The Pack In Action
        </h2>
        <p className="text-md md:text-lg max-w-2xl mx-auto mb-12 font-inter">
          Not models. Just wulfs like you. Get featured. Earn Fangs. Show the world how
          you wear your wild.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {mockReviewPhotos.map((member) => (
            <div
              key={member.id}
              className="group relative rounded-lg overflow-hidden border border-gray-700 shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={member.imageUrl}
                  alt={`Pack Member ${member.id} Review`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-end p-4 group-hover:bg-black/50 transition-colors duration-500">
                <p className="text-xs font-montserrat text-white opacity-80 group-hover:text-white group-hover:scale-105 transition-all duration-500">
                  @PackMember{member.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}