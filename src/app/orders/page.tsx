"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/context/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type OrderStatus = "In Progress" | "Delivered" | "Cancelled";

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
}

const statusColors: Record<OrderStatus, string> = {
  "In Progress": "bg-red-600 text-white",
  Delivered: "bg-green-600 text-white",
  Cancelled: "bg-gray-600 text-white",
};

export default function OrdersPage() {
  const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
  async function getOrders() {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        console.error("API returned error:", await res.text());
        return;
      }
      const data: Order[] = await res.json();
      setFetchedOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  getOrders();
}, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "active")
      return fetchedOrders.filter((o) => o.status === "In Progress");
    return fetchedOrders.filter((o) => o.status !== "In Progress");
  }, [activeTab, fetchedOrders]);

  return (
    <>
      <Header />

      <div className="pt-[96px] min-h-screen bg-black text-white font-sans flex flex-col items-center relative">
        <main className="container mx-auto px-4 md:px-0 max-w-4xl py-8 flex flex-col space-y-8">
          <h1 className="text-2xl md:text-3xl font-oswald uppercase font-bold tracking-widest text-red-600 text-center mb-6">
            THE HUNT COMMAND CENTER
          </h1>

          {/* Tabs */}
          <div className="flex justify-center space-x-6 border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 font-montserrat uppercase text-sm md:text-base transition-colors ${
                activeTab === "active"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-400 hover:text-red-600"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Hunts
            </button>
            <button
              className={`py-2 px-4 font-montserrat uppercase text-sm md:text-base transition-colors ${
                activeTab === "history"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-400 hover:text-red-600"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Hunted History
            </button>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-400 space-y-6 py-16 flex flex-col items-center">
              <Image
                src="/assets/empty-orders.png"
                alt="No Orders"
                width={200}
                height={200}
                className="opacity-70"
              />
              <p className="text-lg md:text-xl font-montserrat">
                You haven’t hunted anything yet.
              </p>
              <p className="text-sm md:text-base font-inter text-gray-500 max-w-md">
                Once you place an order, it will appear here. Start exploring our
                premium collection to begin your hunt.
              </p>
              <Link href="/drops">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-montserrat uppercase">
                  Continue Hunting
                </Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 shadow-xl hover:shadow-2xl transition-all"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-montserrat text-gray-400">
                      Hunt ID: {order.id}
                    </p>
                    <p className="text-xs font-inter text-gray-500">
                      Date: {order.date}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-montserrat ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center gap-4 bg-gray-800 rounded-lg p-3"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-md font-oswald uppercase text-white">
                          {item.name}
                        </p>
                        <p className="text-sm font-inter text-gray-400">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-sm font-inter text-gray-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-md font-montserrat font-bold text-white">
                    Total: ${order.total.toFixed(2)}
                  </p>
                  {order.status === "In Progress" && (
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-montserrat uppercase">
                      Track Hunt
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
