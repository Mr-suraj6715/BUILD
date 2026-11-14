"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"ALL" | "OVERSIZED" | "GRAPHIC" | "MINIMAL" | "LIMITED">("ALL");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "OVERSIZED") {
      return (
        p.fit.toLowerCase().includes("oversized") ||
        p.fit.toLowerCase().includes("boxy") ||
        p.title.toLowerCase().includes("oversized")
      );
    }
    if (activeTab === "GRAPHIC") {
      return (
        p.category?.slug === "graphic-t-shirts" ||
        p.collection?.slug === "graphic-universe" ||
        p.title.toLowerCase().includes("graphic") ||
        p.title.toLowerCase().includes("vision") ||
        p.title.toLowerCase().includes("ronin") ||
        p.title.toLowerCase().includes("glitch")
      );
    }
    if (activeTab === "MINIMAL") {
      return (
        p.category?.slug === "minimal-t-shirts" ||
        p.title.toLowerCase().includes("minimal") ||
        p.title.toLowerCase().includes("matrix") ||
        p.title.toLowerCase().includes("astral") ||
        p.title.toLowerCase().includes("culture")
      );
    }
    if (activeTab === "LIMITED") {
      return p.isLimited || p.category?.slug === "limited-edition-t-shirts" || p.collection?.slug === "limited-drops";
    }
    return true;
  });

  const displayList = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div>
      {/* Editorial Zara-style Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#D4D0C8] gap-4">
        <div>
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#777777] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#151515]" />
            CURATED STREETWEAR DROP // 2025
          </span>
          <h2 className="font-display text-4xl sm:text-5xl uppercase font-black tracking-tight text-[#151515] mt-1">
            TRENDING RUNWAY TEES
          </h2>
        </div>

        {/* Minimalist Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "ALL TEES" },
            { id: "OVERSIZED", label: "OVERSIZED BOX" },
            { id: "GRAPHIC", label: "GRAPHIC PRINTS" },
            { id: "MINIMAL", label: "MINIMAL LUXURY" },
            { id: "LIMITED", label: "LIMITED EDITIONS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap rounded-none border ${
                activeTab === tab.id
                  ? "bg-[#151515] text-[#F5F3EE] border-[#151515] shadow-xs"
                  : "bg-transparent text-[#666666] border-transparent hover:text-[#151515] hover:border-[#D4D0C8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product 4-Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayList.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#151515] text-[#F5F3EE] hover:bg-[#D8FF36] hover:text-[#151515] font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 border border-[#151515]"
        >
          <span>VIEW FULL T-SHIRT ARCHIVE ({products.length} STYLES)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
