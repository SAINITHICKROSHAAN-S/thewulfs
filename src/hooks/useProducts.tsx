'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
}
