"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Flame, Sparkles } from "lucide-react";

export default function PriceZones() {
  const zones = [
    {
      title: "EVERYDAY STEALS",
      priceTag: "UNDER ₹1,499",
      description: "240 GSM organic ringspun cotton tees for everyday minimal uniform.",
      badge: "ZUDIO-TIER VALUE",
      href: "/shop?maxPrice=1499",
      bgGradient: "from-[#151515] to-[#262626]",
      textColor: "text-[#F5F3EE]",
      accentColor: "text-[#D8FF36]",
      icon: Tag,
    },
    {
      title: "SIGNATURE HEAVYWEIGHT",
      priceTag: "₹1,500 — ₹1,999",
      description: "260 GSM Tokyo drop-shoulder silhouettes with high-density screenprint hits.",
      badge: "H&M PREMIUM CUT",
      href: "/shop?minPrice=1500&maxPrice=1999",
      bgGradient: "from-[#E8E5DE] to-[#D4D0C8]",
      textColor: "text-[#151515]",
      accentColor: "text-[#151515]",
      icon: Flame,
    },
    {
      title: "LIMITED ARCHIVE RUNS",
      priceTag: "FROM ₹2,000",
      description: "280 GSM luxury acid-wash blanks with numbered cryptographic tags.",
      badge: "ZARA RUNWAY CAPSULE",
      href: "/shop?minPrice=2000",
      bgGradient: "from-[#101010] to-[#1F1F1F]",
      textColor: "text-[#F5F3EE]",
      accentColor: "text-[#D8FF36]",
      icon: Sparkles,
    },
  ];

  return (
    <section className="w-full bg-[#F5F3EE] py-12 lg:py-16 border-b border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#D4D0C8]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#777777]">
              // FAST-FASHION MEETS STREET LUXURY
            </span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase font-black tracking-tight text-[#151515] mt-1">
              SHOP BY PRICE POINT
            </h2>
          </div>
          <span className="font-mono text-xs text-[#666666] uppercase">
            CLEAR PRICING • NO HIDDEN FEES • CASH ON DELIVERY AVAILABLE
          </span>
        </div>

        {/* 3 Price Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <Link
                key={zone.title}
                href={zone.href}
                className={`group relative p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br ${zone.bgGradient} ${zone.textColor} shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D4D0C8] hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-[#D8FF36] text-[#151515] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {zone.badge}
                    </span>
                    <Icon className={`w-5 h-5 ${zone.accentColor}`} />
                  </div>

                  <div className="mt-6">
                    <span className="font-display text-4xl sm:text-5xl font-black block tracking-tight">
                      {zone.priceTag}
                    </span>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
                      {zone.title}
                    </h3>
                  </div>

                  <p className="font-sans text-xs sm:text-sm mt-3 opacity-75 leading-relaxed">
                    {zone.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider group-hover:underline">
                  <span>EXPLORE STYLES</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
