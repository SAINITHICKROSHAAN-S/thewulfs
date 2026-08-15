'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

type Props = {
  product: Product;
  onRemove: (id: number) => void; // ✅ number
  onAddToCart?: (product: Product) => void;
};

export default function WishlistItemCard({ product, onRemove, onAddToCart }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
      className="w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm bg-white/5"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden bg-gray-900">
        {product.imageUrl || product.imageUrl?.[0] ? (
          <Image
            src={product.imageUrl || product.imageUrl?.[0]!} // fallback to first image
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold leading-5 truncate">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-1">₹{Number(product.price).toFixed(2)}</p>
        {product.description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end">
        {onAddToCart && (
          <Button size="sm" onClick={() => onAddToCart(product)}>
            Add to Cart
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onRemove(product.id)}>
          Remove
        </Button>
      </div>
    </motion.article>
  );
}
