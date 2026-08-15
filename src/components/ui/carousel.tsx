"use client";

import * as React from "react";
import useEmblaCarousel, {
  UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];

const CarouselContext = React.createContext<{
  carouselApi: CarouselApi | null;
}>({
  carouselApi: null,
});

export function Carousel({
  orientation = "horizontal",
  className,
  children,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: orientation === "horizontal" ? "x" : "y",
    align: "start",
    loop: false,
    dragFree: true, // ✅ smooth free drag/swipe
  });

  return (
    <CarouselContext.Provider value={{ carouselApi: emblaApi }}>
      <div
        ref={emblaRef}
        className={cn(
          "overflow-hidden",
          orientation === "horizontal" ? "-mx-2" : "-my-2",
          className
        )}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex",
        "touch-pan-y touch-pan-x select-none", // ✅ smooth drag
        "-ml-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CarouselItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("pl-2 shrink-0 grow-0 basis-full", className)}>
      {children}
    </div>
  );
}
