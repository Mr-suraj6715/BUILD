"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  originalPrice: number;
  fabric: string;
  gsm: number;
  fit: string;
  isNewDrop?: boolean;
  isBestseller?: boolean;
  isLimited?: boolean;
  rating?: number;
  category?: { name: string; slug: string } | null;
  collection?: { name: string; slug: string } | null;
  images: { url: string; alt: string; isPrimary: boolean }[];
  variants?: {
    id: string;
    size: string;
    color: string;
    colorHex: string;
    stock: number;
  }[];
}

export default function HomeTrendingTabs({ products }: { products: ProductItem[] }) {
  const [activeTab, setActiveTab] = useState<"ALL" | "GRAPHIC" | "OVERSIZED" | "LIMITED">("ALL");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "GRAPHIC") {
      return (
        p.collection?.slug === "graphic-universe" ||
        p.title.toLowerCase().includes("graphic") ||
        p.title.toLowerCase().includes("vision") ||
        p.title.toLowerCase().includes("culture")
      );
    }
    if (activeTab === "OVERSIZED") {
      return (
        p.fit.toLowerCase().includes("oversized") ||
        p.fit.toLowerCase().includes("boxy") ||
        p.title.toLowerCase().includes("oversized")
      );
    }
    if (activeTab === "LIMITED") {
      return p.isLimited || p.collection?.slug === "limited-drops";
    }
    return true;
  });

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div>
      {/* Filter Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#D4D0C8] pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-[#536500] uppercase tracking-widest block">
            // DEPLOYED STYLES
          </span>
          <h2 className="font-display text-4xl sm:text-5xl uppercase font-black tracking-tight text-[#151515] mt-1">
            TRENDING IN LABS
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-[#E8E5DE] p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all ${
              activeTab === "ALL"
                ? "bg-[#151515] text-[#F5F3EE] shadow-sm"
                : "text-[#555555] hover:text-[#151515]"
            }`}
          >
            ALL DROPS
          </button>
          <button
            onClick={() => setActiveTab("GRAPHIC")}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all ${
              activeTab === "GRAPHIC"
                ? "bg-[#151515] text-[#F5F3EE] shadow-sm"
                : "text-[#555555] hover:text-[#151515]"
            }`}
          >
            GRAPHIC TEES
          </button>
          <button
            onClick={() => setActiveTab("OVERSIZED")}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all ${
              activeTab === "OVERSIZED"
                ? "bg-[#151515] text-[#F5F3EE] shadow-sm"
                : "text-[#555555] hover:text-[#151515]"
            }`}
          >
            OVERSIZED SOLIDS
          </button>
          <button
            onClick={() => setActiveTab("LIMITED")}
            className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all ${
              activeTab === "LIMITED"
                ? "bg-[#151515] text-[#F5F3EE] shadow-sm"
                : "text-[#555555] hover:text-[#151515]"
            }`}
          >
            LIMITED COLLABS
          </button>
        </div>
      </div>

      {/* Product 4-Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

