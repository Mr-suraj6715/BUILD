"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck, Layers, Shirt, Wind, Infinity as InfinityIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Colorway {
  id: string;
  name: string;
  hex: string;
  slug: string;
  price?: number;
  originalPrice?: number;
  campaignImg: string;
  frontImg: string;
  backImg: string;
  description: string;
}

const colorways: Colorway[] = [
  {
    id: "navy",
    name: "Midnight Navy",
    hex: "#1B2430",
    slug: "build-series-better-tomorrow-tee-navy",
    campaignImg: "/images/campaign/build-series-navy.jpg",
    frontImg: "/images/products/build-model-navy-front.jpg",
    backImg: "/images/products/build-model-navy-back.jpg",
    description: "Deep nocturnal navy with ivory screenprinted globe architecture and high-density front chest brandmark.",
  },
  {
    id: "burgundy",
    name: "Burgundy Wine",
    hex: "#581825",
    slug: "build-series-better-tomorrow-tee-burgundy",
    campaignImg: "/images/campaign/build-series-burgundy.jpg",
    frontImg: "/images/products/build-model-burgundy-front.jpg",
    backImg: "/images/products/build-model-burgundy-back.jpg",
    description: "Rich vintage wine red cotton milled with enzyme treatment for an unmatched heavyweight drape.",
  },
  {
    id: "sand",
    name: "Vintage Sand",
    hex: "#D2B48C",
    slug: "build-series-better-tomorrow-tee-sand",
    campaignImg: "/images/campaign/build-series-sand.jpg",
    frontImg: "/images/products/build-model-sand-front.jpg",
    backImg: "/images/products/build-model-sand-back.jpg",
    description: "Earthy bone-tan shade with deep noir architectural line art and understated chest identity.",
  },
];

export default function BuildSeriesShowcase() {
  const [items, setItems] = useState<Colorway[]>(colorways);
  const [selectedColor, setSelectedColor] = useState<Colorway>(colorways[0]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch("/api/showcase")
      .then((res) => res.json())
      .then((data) => {
        if (data.showcase && data.showcase.length > 0) {
          setItems(data.showcase);
          setSelectedColor((prev) => data.showcase.find((c: Colorway) => c.id === prev.id) || data.showcase[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="lookbook" className="w-full bg-[#101010] text-[#F5F3EE] py-12 sm:py-20 px-3 sm:px-6 lg:px-8 border-b border-[#262626] relative overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D8FF36]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#262626] pb-6 sm:pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D8FF36]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#D8FF36] font-bold">
                CORE T-SHIRT COLLECTION // 2026
              </span>
            </div>
            <h2 className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl uppercase text-white font-black tracking-tight leading-none">
              THE BUILD SERIES
            </h2>
            <p className="font-sans text-xs sm:text-base text-[#AAAAAA] mt-2 max-w-xl">
              Engineered with 240 GSM heavy cotton and our signature &quot;Building A Better Tomorrow&quot; globe architecture artwork.
            </p>
          </div>

          {/* Colorway Pill Selector */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono uppercase text-[#777777] mr-1 hidden sm:inline">
              SELECT COLOR:
            </span>
            {items.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-2.5 border text-[11px] sm:text-xs font-mono uppercase font-bold transition-all duration-200 ${
                  selectedColor.id === c.id
                    ? "bg-[#D8FF36] text-[#101010] border-[#D8FF36] shadow-md scale-105"
                    : "bg-[#181818] text-[#CCCCCC] border-[#333333] hover:border-[#666666]"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/40 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Grid: Full Campaign Board + Interactive Two-Image Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Full Editorial Campaign Board (7 cols) */}
          <div className="lg:col-span-7 bg-[#161616] border border-[#2E2E2E] overflow-hidden group/board relative flex flex-col">
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
              <img
                src={selectedColor.campaignImg}
                alt={`${selectedColor.name} Campaign Board`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/board:scale-102"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xs text-[#D8FF36] font-mono text-[10px] px-2.5 py-1 font-bold uppercase border border-white/10">
                CAMPAIGN SPEC SHEET // {selectedColor.name.toUpperCase()}
              </div>
            </div>

            {/* Campaign specs footer */}
            <div className="p-6 bg-[#181818] border-t border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#D8FF36] uppercase font-bold">
                  {selectedColor.name} Edition
                </span>
                <p className="font-sans text-xs text-[#AAAAAA] mt-0.5">
                  {selectedColor.description}
                </p>
              </div>
              <Link
                href={`/product/${selectedColor.slug}`}
                className="px-5 py-2.5 bg-[#D8FF36] text-[#101010] hover:bg-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shrink-0"
              >
                <span>VIEW SPEC SHEET</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Interactive Two-Image Card with Hover Effect (5 cols) */}
          <div className="lg:col-span-5 bg-[#161616] border border-[#2E2E2E] p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
                <span className="font-mono text-xs font-bold text-[#AAAAAA] uppercase tracking-wider">
                  INTERACTIVE PRODUCT VIEW
                </span>
                <span className="font-mono text-[10px] text-[#D8FF36] uppercase bg-[#222222] px-2 py-0.5">
                  <span className="hidden sm:inline">HOVER TO REVEAL BACK ART</span>
                  <span className="sm:hidden">TAP TO REVEAL BACK ART</span>
                </span>
              </div>

              {/* Dual-Image Interactive Card with Mobile Tap Support */}
              <div
                className="relative aspect-[4/5] w-full max-w-[320px] mx-auto overflow-hidden bg-[#1A1A1A] border border-[#333333] group/card cursor-pointer shadow-xl select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsHovered((prev) => !prev)}
              >
                {/* Front Image */}
                <img
                  src={selectedColor.frontImg}
                  alt={`${selectedColor.name} Front View`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover/card:scale-105"
                />

                {/* Back Image (Hover / Tap Swap) */}
                <img
                  src={selectedColor.backImg}
                  alt={`${selectedColor.name} Back View`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none group-hover/card:scale-105 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
                  <span className="bg-[#D8FF36] text-[#101010] font-mono text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">
                    FLAGSHIP DROP
                  </span>
                  <span className="bg-[#101010] text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 border border-white/20">
                    240 GSM HEAVY
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-[#D8FF36] text-[9px] font-mono px-2 py-0.5 z-10">
                  {isHovered ? "BACK VIEW (GLOBE ART)" : "FRONT VIEW (CHEST)"}
                </div>
              </div>

              {/* Mobile View Toggle Buttons */}
              <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsHovered(false)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase font-bold border transition-colors ${
                    !isHovered
                      ? "bg-[#D8FF36] text-black border-[#D8FF36]"
                      : "bg-[#202020] text-[#888] border-[#333]"
                  }`}
                >
                  Front View
                </button>
                <button
                  type="button"
                  onClick={() => setIsHovered(true)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase font-bold border transition-colors ${
                    isHovered
                      ? "bg-[#D8FF36] text-black border-[#D8FF36]"
                      : "bg-[#202020] text-[#888] border-[#333]"
                  }`}
                >
                  Back View
                </button>
              </div>

              {/* Title & Price */}
              <div className="mt-5 text-center sm:text-left">
                <span className="text-[11px] font-mono text-[#AAAAAA] uppercase tracking-wider block">
                  BUILD® THE CORE SERIES
                </span>
                <h3 className="font-display text-2xl sm:text-3xl uppercase font-bold text-white mt-0.5">
                  BUILDING A BETTER TOMORROW
                </h3>
                <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-2">
                  <span className="font-display text-2xl text-[#D8FF36] font-bold">
                    ₹{selectedColor.price || 1699}
                  </span>
                  <span className="text-sm font-mono text-[#777777] line-through">
                    ₹{selectedColor.originalPrice || 2699}
                  </span>
                  <span className="text-[10px] font-mono text-[#D8FF36] bg-[#222222] px-1.5 py-0.5 font-bold uppercase">
                    {Math.round((1 - (selectedColor.price || 1699) / (selectedColor.originalPrice || 2699)) * 100)}% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Shop Button */}
            <div className="pt-6 mt-6 border-t border-[#262626]">
              <Link
                href={`/product/${selectedColor.slug}`}
                className="w-full py-4 bg-[#D8FF36] text-[#101010] hover:bg-white font-mono text-xs font-black uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>SHOP {selectedColor.name.toUpperCase()} (₹{selectedColor.price || 1699})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Craftsmanship Pillars directly from official campaign banner */}
        <div className="pt-6 border-t border-[#262626]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">🌱</span>
              <span className="font-display text-base uppercase text-white font-bold">
                100% COTTON
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                Premium Combed
              </span>
            </div>

            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">⚖️</span>
              <span className="font-display text-base uppercase text-white font-bold">
                240 GSM
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                Heavy Fabric
              </span>
            </div>

            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">👕</span>
              <span className="font-display text-base uppercase text-white font-bold">
                OVERSIZED FIT
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                Boxy Street Silhouette
              </span>
            </div>

            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">💨</span>
              <span className="font-display text-base uppercase text-white font-bold">
                BREATHABLE
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                All-Day Comfort
              </span>
            </div>

            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">🎨</span>
              <span className="font-display text-base uppercase text-white font-bold">
                SILKSCREEN
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                Long Lasting Inks
              </span>
            </div>

            <div className="bg-[#181818] border border-[#2E2E2E] p-4 text-center flex flex-col items-center justify-center group hover:border-[#D8FF36] transition-colors">
              <span className="text-2xl mb-1.5">🪡</span>
              <span className="font-display text-base uppercase text-white font-bold">
                REINFORCED
              </span>
              <span className="text-[10px] font-mono text-[#888888] uppercase mt-0.5">
                Durable Twin Stitch
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
