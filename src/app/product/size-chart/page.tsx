"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Added for dynamic back navigation
import { Separator } from "@/components/ui/separator";

const sizeData = {
  tops: {
    in: [
      { size: "S", chest: "34-36", waist: "28-30", sleeve: "32" },
      { size: "M", chest: "38-40", waist: "32-34", sleeve: "33" },
      { size: "L", chest: "42-44", waist: "36-39", sleeve: "34" },
      { size: "XL", chest: "46-48", waist: "40-42", sleeve: "35" },
      { size: "XXL", chest: "50-52", waist: "44-48", sleeve: "36" },
    ],
    cm: [
      { size: "S", chest: "86-91", waist: "71-76", sleeve: "81" },
      { size: "M", chest: "97-102", waist: "81-86", sleeve: "84" },
      { size: "L", chest: "107-112", waist: "91-99", sleeve: "86" },
      { size: "XL", chest: "117-122", waist: "102-107", sleeve: "89" },
      { size: "XXL", chest: "127-132", waist: "112-122", sleeve: "91" },
    ],
  },
  bottoms: {
    in: [
      { size: "S", waist: "28-30", inseam: "30" },
      { size: "M", waist: "32-34", inseam: "31" },
      { size: "L", waist: "36-38", inseam: "32" },
      { size: "XL", waist: "40-42", inseam: "33" },
    ],
    cm: [
      { size: "S", waist: "71-76", inseam: "76" },
      { size: "M", waist: "81-86", inseam: "79" },
      { size: "L", waist: "91-97", inseam: "81" },
      { size: "XL", waist: "102-107", inseam: "84" },
    ],
  },
};

const howToMeasure = {
  tops: [
    { title: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
    { title: "Waist", desc: "Measure around the narrowest part of your waist, keeping the tape horizontal." },
    { title: "Sleeve", desc: "Measure from the center back of your neck, across your shoulder, and down to your wrist." },
  ],
  bottoms: [
    { title: "Waist", desc: "Measure around the narrowest part of your waist, keeping the tape horizontal." },
    { title: "Inseam", desc: "Measure from the top of your inner leg to the bottom of your ankle." },
  ],
};

export default function SizeChartPage() {
  const [activeTab, setActiveTab] = useState<"tops" | "bottoms">("tops");
  const [activeUnit, setActiveUnit] = useState<"in" | "cm">("in");
  const router = useRouter(); // ✅ Initialize router

  const currentData = sizeData[activeTab][activeUnit];
  const currentMeasure = howToMeasure[activeTab];

  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col">
      {/* ✅ Unified Header (Visible on all devices) */}
      <header className="sticky top-0 z-10 w-full bg-black/80 backdrop-blur-sm p-4 border-b border-gray-800 flex items-center justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-red-500 transition-colors duration-300"
        >
          <Image
            src="/assets/back-arrow.png"
            alt="Back"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="hidden md:inline font-montserrat text-sm uppercase">Back</span>
        </button>
        <h1 className="text-xl font-oswald uppercase font-bold tracking-wide flex-1 text-center pr-6">
          Size Chart
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:py-16 md:px-0 max-w-lg mx-auto w-full">
        {/* Tab & Unit Switchers */}
        <div className="flex flex-col items-center w-full mb-6">
          <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-full mb-4 w-full">
            <button
              onClick={() => setActiveTab("tops")}
              className={`flex-1 py-2 rounded-full font-montserrat font-bold transition-colors duration-300 ${
                activeTab === "tops"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tops
            </button>
            <button
              onClick={() => setActiveTab("bottoms")}
              className={`flex-1 py-2 rounded-full font-montserrat font-bold transition-colors duration-300 ${
                activeTab === "bottoms"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Bottoms
            </button>
          </div>
          <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-full">
            <button
              onClick={() => setActiveUnit("in")}
              className={`py-1 px-4 rounded-full font-montserrat font-bold transition-colors duration-300 ${
                activeUnit === "in"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              IN
            </button>
            <button
              onClick={() => setActiveUnit("cm")}
              className={`py-1 px-4 rounded-full font-montserrat font-bold transition-colors duration-300 ${
                activeUnit === "cm"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="w-full overflow-x-auto mb-8">
          <table className="min-w-full table-auto text-left font-montserrat border-collapse bg-gray-900 border border-gray-800 rounded-lg">
            <thead className="bg-gray-800">
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                {activeTab === "tops" ? (
                  <>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Chest</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Waist</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Sleeve</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Waist</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Inseam</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-800 transition-colors duration-200">
                  <td className="py-3 px-4 font-bold text-white text-lg">{item.size}</td>
                  {"chest" in item && <td className="py-3 px-4 text-gray-300">{item.chest}</td>}
                  {"waist" in item && <td className="py-3 px-4 text-gray-300">{item.waist}</td>}
                  {"sleeve" in item && <td className="py-3 px-4 text-gray-300">{item.sleeve}</td>}
                  {"inseam" in item && <td className="py-3 px-4 text-gray-300">{item.inseam}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Section */}
        <section className="w-full">
          <h2 className="text-xl font-oswald uppercase font-bold text-red-600 mb-4">
            How to Measure
          </h2>
          <div className="space-y-4 font-inter text-gray-400 text-sm">
            {currentMeasure.map((m, index) => (
              <div key={index}>
                <h3 className="text-base text-white font-montserrat font-bold">{m.title}:</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-black border-t border-gray-800 md:hidden">
        <div className="flex justify-around items-center h-16 text-gray-400">
          {/* Your nav icons unchanged */}
        </div>
      </nav>
    </div>
  );
}
