// src/components/MoonWidgetWrapper.tsx
"use client";

import dynamic from "next/dynamic";

export const MoonWidgetWrapper = dynamic(
  () => import("@/components/MoonWidget").then((mod) => mod.MoonWidget),
  { ssr: false } // disables server-side rendering
);
