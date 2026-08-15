import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;                  // number, consistent with CartItem
  imageUrl: string | StaticImageData;
  sizes?: string[];
  color?: string;
  description?: string;
}