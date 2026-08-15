import { Product } from './product';

export interface WishlistItem extends Product {
  id: number;                    // must match Product.id
  userId?: number;               // optional for new wishlist items
  addedAt?: string;
  selectedSize?: string;         // optional, for frontend
  selectedColor?: string;        // optional, for frontend
}
