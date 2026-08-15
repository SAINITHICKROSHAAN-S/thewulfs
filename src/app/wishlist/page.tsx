'use client';

import { motion } from 'framer-motion';
import { useWishlist } from "@/context/WishListContext";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
// FIX: Added missing useState and useEffect imports
import { useState, useEffect } from 'react'; 
// FIX: Import mock products to enrich the basic wishlist item data
import { mockProducts } from '@/data/mock-data';

// Define the shape of an enriched item for rendering
interface EnrichedWishlistItem {
  id: string; // Wishlist item ID
  productId: string; // The product's ID (UUID string)
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
}

export default function WishlistPage() {
  // FIX: Added clearWishlist to the destructured list
  const { items, removeFromWishlist, clearWishlist, hydrated } = useWishlist();

  // Introduce state to hold the enriched product data
  const [enrichedItems, setEnrichedItems] = useState<EnrichedWishlistItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Logic to enrich the wishlist items with mock product details
  useEffect(() => {
    if (hydrated) {
      const enrichData = () => {
        const detailedItems = items.map(wishlistItem => {
          // Look up the full product details using the productId
          const productDetail = mockProducts.find(p => p.id.toString() === wishlistItem.productId);

          if (productDetail) {
            // Combine wishlist metadata with full product details
            return {
              id: wishlistItem.id, 
              productId: wishlistItem.productId, 
              name: productDetail.name || "Unknown Product",
              // Ensure price is a string for rendering
              price: productDetail.price || "N/A",
              imageUrl: (productDetail.imageUrl as string) || "/placeholder.png", 
              description: (productDetail as any).description, 
            } as EnrichedWishlistItem;
          }
          // If product detail is missing, return a minimal object with safe defaults
          return {
            id: wishlistItem.id,
            productId: wishlistItem.productId,
            name: "Deleted Item",
            price: "N/A",
            imageUrl: "/placeholder.png",
            description: "Product details unavailable."
          } as EnrichedWishlistItem;
        });

        setEnrichedItems(detailedItems);
        setLoadingProducts(false);
      };
      
      enrichData();
    }
  }, [hydrated, items]); 

  if (!hydrated || loadingProducts) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-gray-400 text-sm"
        >
          Loading your wishlist...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <Header />

      <div className="relative z-10 px-6 sm:px-12 py-24">
        {/* Heading */}
        <div className="flex flex-col items-start mb-12">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl font-anton uppercase tracking-[0.12em] text-white mb-2 relative"
          >
            Your Wishlist
            <motion.div
              className="absolute left-0 -bottom-2 w-32 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </motion.h1>
          <p className="text-gray-400 font-inter text-sm sm:text-base max-w-lg">
            All your selected drops in one place — don’t let your favorites slip away.
          </p>
        </div>

        {/* Empty State */}
        {enrichedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center h-[60vh]"
          >
            {/* Floating Wolf Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative mb-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/assets/wolf-outline.svg"
                  alt="Empty Wishlist"
                  width={160}
                  height={160}
                  className="opacity-90"
                  unoptimized
                />
              </motion.div>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold font-anton text-white uppercase mb-3 tracking-wider">
              The Pack is Waiting
            </h2>
            <p className="text-gray-400 max-w-md mb-8 text-sm sm:text-base font-inter">
              Looks like your wishlist is still empty. Don’t let the best drops slip away — add your favorite fits to the pack.
            </p>
            <Link href="/drops">
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                Explore Drops
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-4">
            {enrichedItems.map((item: EnrichedWishlistItem) => (
              <motion.div
                key={item.id}
                layout
                whileHover={{ scale: 1.02, boxShadow: '0 12px 25px rgba(239,68,68,0.3)' }}
                transition={{ type: 'spring', stiffness: 60, damping: 12, duration: 1.2 }}
                className="flex flex-col sm:flex-row bg-[#111] rounded-xl border border-red-600/20 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-700"
              >
                {/* Image */}
                <div className="relative w-full sm:w-1/5 aspect-square overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-oswald font-bold uppercase tracking-wide mb-1">{item.name}</h3>
                    <p className="text-sm sm:text-base font-oswald text-red-600 mb-1">{item.price}</p>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">
                      {item.description || "Premium streetwear drop crafted for style and comfort."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="flex-1 h-12 border border-white text-white font-semibold transition-all duration-300 shadow-sm rounded-lg bg-transparent hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                    >
                      Remove
                    </Button>
                    <Link href={`/product/${item.productId}`} className="flex-1">
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-400 shadow-sm rounded-lg"
                      >
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Clear Wishlist */}
        {enrichedItems.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              // FIX: clearWishlist is now correctly destructured and accessible
              onClick={clearWishlist} 
              className="bg-gray-800 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-sm transition-all duration-400 hover:shadow-md hover:scale-105"
            >
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}