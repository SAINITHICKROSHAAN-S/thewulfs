export interface CartItem {
  id?: number;          // cart item id
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  addedAt?: string;
}
