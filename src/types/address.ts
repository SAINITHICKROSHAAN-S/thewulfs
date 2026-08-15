export interface Address {
  id?: number;
  userId?: number;
  label?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
  createdAt?: string;
}
