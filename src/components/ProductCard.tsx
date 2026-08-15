"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  imageUrl: string | StaticImageData; // <-- allow both string & imported image
  price: string;
}


export function ProductCard({ id, name, imageUrl, price }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden border border-gray-800 hover:border-red-700 transition-all duration-500 bg-neutral-950">
        <div className="relative w-full h-[400px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
            unoptimized
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-lg font-semibold font-montserrat tracking-wide">{name}</h3>
          <p className="text-sm text-gray-400 mt-1 font-inter">{price}</p>
          <Button className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm uppercase transition-transform duration-300 hover:scale-105">
            Shop Now
          </Button>
        </div>
      </div>
    </Link>
  );
}
