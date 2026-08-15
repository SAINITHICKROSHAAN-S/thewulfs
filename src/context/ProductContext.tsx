"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/product");
      setProducts(res.data as Product[]); // ✅ Type-cast here
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const res = await axios.post("/api/product", product);
      setProducts((prev) => [...prev, res.data as Product]); // ✅ Type-cast here
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProductContext must be used within a ProductProvider");
  return context;
};
