"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Truck, Package, CheckCircle2, Clock } from "lucide-react";

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${orderQuery.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        setError("No shipment found matching this Order ID. Please check the spelling.");
        setOrderData(null);
      } else {
        setOrderData(data.order);
      }
    } catch {
      setError("Failed to fetch tracking data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full min-h-screen">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
          LIVE COURIER RADAR
        </span>
        <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-3">
          TRACK YOUR DROP
        </h1>
        <p className="text-xs text-[#777777] font-sans">
          Enter your BUILD order ID (e.g. BLD-2505-8821) to check fulfillment state and dispatch timeline.
        </p>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="mt-6 flex gap-2">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="e.g. BLD-2505-8821"
            className="flex-1 bg-[#E8E5DE] border border-[#D4D0C8] px-4 py-3 text-sm font-mono text-[#151515] placeholder:text-[#777777] focus:outline-none focus:border-[#151515]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#101010] text-[#D8FF36] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
          >
            {loading ? "Locating..." : "Track"}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 text-xs font-mono text-center mb-8">
          {error}
        </div>
      )}

      {orderData && (
        <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-[#D4D0C8]">
            <div>
              <span className="text-xs font-mono text-[#777777]">ORDER NUMBER</span>
              <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                {orderData.orderNumber}
              </h2>
            </div>
            <div className="mt-2 sm:mt-0 text-left sm:text-right">
              <span className="text-xs font-mono text-[#777777]">CURRENT STATUS</span>
              <div className="text-sm font-bold uppercase text-[#101010] bg-[#D8FF36] px-3 py-1 mt-1 inline-block">
                {orderData.status}
              </div>
            </div>
          </div>

          {/* Courier & Tracking Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-[#F5F3EE] p-4 border border-[#D4D0C8]">
            <div>
              <span className="text-[#777777] block text-[10px]">COURIER PARTNER</span>
              <span className="font-bold text-[#151515]">{orderData.courierName || "Delhivery Express"}</span>
            </div>
            <div>
              <span className="text-[#777777] block text-[10px]">AIR WAYBILL (AWB) / TRACKING ID</span>
              <span className="font-bold text-blue-700">{orderData.trackingNumber || "Pending Courier Assignment"}</span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#151515] mb-3">
              ITEMS IN THIS SHIPMENT
            </h3>
            <div className="space-y-2">
              {orderData.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-xs font-mono bg-[#F5F3EE] p-3">
                  <span className="font-bold text-[#151515]">{item.productTitle} ({item.variantSize})</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4D0C8] flex justify-between items-center text-xs">
            <Link href={`/order-success/${orderData.orderNumber}`} className="font-bold uppercase text-[#151515] underline">
              View Full Tax Receipt
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

