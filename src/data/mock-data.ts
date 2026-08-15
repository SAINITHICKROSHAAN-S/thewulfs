import { StaticImageData } from "next/image";

// A single source of truth for all product data.
export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | StaticImageData;
}

export const mockProducts: Product[] = [
  { id: 1, name: "Black Hoodie", price: "$65.00", imageUrl: "https://placehold.co/800x800/262626/FFFFFF?text=Hoodie" },
  { id: 2, name: "Oversized Tee", price: "$40.00", imageUrl: "https://placehold.co/800x800/374151/FFFFFF?text=Tee" },
  { id: 3, name: "Cargo Pants", price: "$80.00", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Pants" },
  { id: 4, name: "Grey Hoodie", price: "$65.00", imageUrl: "https://placehold.co/800x800/4B5563/FFFFFF?text=Hoodie" },
  { id: 5, name: "Oversized Tee", price: "$40.00", imageUrl: "https://placehold.co/800x800/6B7280/FFFFFF?text=Tee" },
  { id: 6, name: "Joggers", price: "$75.00", imageUrl: "https://placehold.co/800x800/4F46E5/FFFFFF?text=Joggers" },
  // Added the missing related products
  { id: 7, name: "Desert Howl Tee", price: "$45.00", imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Desert+Howl+Tee" },
  { id: 8, name: "Night Stalker Joggers", price: "$85.00", imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Night+Stalker+Joggers" },
  { id: 9, name: "Forest Pack Hoodie", price: "$95.00", imageUrl: "https://placehold.co/800x800/1E202B/FFFFFF?text=Forest+Pack+Hoodie" },
];

export const mockPackMembers: Product[] = [
  { id: 1, name: "Person 1", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
  { id: 2, name: "Person 2", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
  { id: 3, name: "Person 3", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
  { id: 4, name: "Person 4", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
  { id: 5, name: "Person 5", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
  { id: 6, name: "Person 6", price: "N/A", imageUrl: "https://placehold.co/800x800/1F2937/FFFFFF?text=Person" },
];
