import { CartItem } from './cart';

export interface Order {
  id: number;
  userId: number;
  date: string;
  status: string;
  total: number;
  items?: CartItem[];
}
