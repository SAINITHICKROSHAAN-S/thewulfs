"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mockProducts } from "@/data/mock-data";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DropsPage() {
  const router = useRouter();
  const productsInDrop = mockProducts;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      {/* Spacer to prevent header overlap */}
      <div className="h-24"></div>

      <main className="container mx-auto px-4 py-8 md:py-16 w-full max-w-6xl">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex-1 text-center">
            <h1 className="text-5xl font-anton uppercase font-extrabold tracking-widest">
              BLOOD MOON DROP
            </h1>
          </div>
          <div className="w-6 h-6"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center text-sm font-montserrat text-gray-400 mb-12"
        >
          For the pack that hunts under the crimson sky.
        </motion.p>

        {/* Product Grid */}
        {productsInDrop.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {productsInDrop.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 * index,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.5 },
                }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className="block relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-700 shadow-md hover:shadow-red-900/30 transition-all duration-500 cursor-pointer"
                >
                  {/* Product Image with Zoom Effect */}
                  <div className="relative w-full h-[400px] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 text-center">
                    <h2 className="font-montserrat text-lg font-semibold tracking-wide mb-2">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-400">{product.price}</p>
                  </div>

                  {/* Subtle Overlay Glow on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-red-500 rounded-2xl pointer-events-none"
                  ></motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center py-32"
          >
            <Image
              src="/empty-cart.svg"
              alt="No Drops"
              width={160}
              height={160}
              className="mb-6 opacity-80"
            />
            <h2 className="text-2xl font-montserrat font-semibold mb-3">
              No Drops Available
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">
              Stay tuned! Our next drop is coming soon. Meanwhile, explore our
              collection.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 border border-red-700 text-red-500 rounded-full font-semibold hover:bg-red-700 hover:text-white transition-all"
            >
              <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                Continue Shopping
              </motion.span>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
