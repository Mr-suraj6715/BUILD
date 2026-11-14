"use client";

import React from "react";
import Link from "next/link";

interface CategoryTile {
  name: string;
  subtitle: string;
  href: string;
  image: string;
  badge?: string;
}

const categories: CategoryTile[] = [
  {
    name: "ALL TEES",
    subtitle: "Complete Archive",
    href: "/shop?category=all-t-shirts",
    image: "/images/stitch/hero-model.jpg",
    badge: "13 STYLES",
  },
  {
    name: "OVERSIZED",
    subtitle: "Tokyo Boxy Cut",
    href: "/shop?category=oversized-t-shirts",
    image: "/images/stitch/collection-oversized.jpg",
    badge: "CORE",
  },
  {
    name: "GRAPHIC",
    subtitle: "Cyber & Anime Hits",
    href: "/shop?category=graphic-t-shirts",
    image: "/images/stitch/collection-graphic.jpg",
    badge: "HOT DROP",
  },
  {
    name: "CUSTOM PRINT",
    subtitle: "1200 DPI DTG Lab",
    href: "/custom-print",
    image: "/images/stitch/custom-mockup.png",
    badge: "STUDIO",
  },
  {
    name: "MINIMALIST",
    subtitle: "Tonal 3D Rubber",
    href: "/shop?category=minimal-t-shirts",
    image: "/images/stitch/collection-original.jpg",
  },
  {
    name: "LIMITED DROPS",
    subtitle: "Numbered Pieces",
    href: "/shop?category=limited-edition-t-shirts",
    image: "/images/stitch/collection-drops.jpg",
    badge: "RARE",
  },
];

export default function StoryCategories() {
  return (
    <section className="w-full bg-[#F5F3EE] py-8 sm:py-10 border-b border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#777777]">
            // EXPLORE DEPARTMENTS
          </span>
          <Link
            href="/shop"
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#151515] hover:text-[#536500] hover:underline"
          >
            VIEW ALL CATEGORIES →
          </Link>
        </div>

        {/* Horizontal Story Rail */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center shrink-0 w-24 sm:w-28 text-center focus:outline-none"
            >
              {/* Circular Avatar Container with Zara/H&M Active Ring */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#151515] via-[#D8FF36] to-[#151515] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#E8E5DE] border-2 border-[#F5F3EE]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {cat.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#151515] text-[#D8FF36] font-mono text-[9px] font-bold px-1.5 py-0.2 tracking-wider uppercase whitespace-nowrap shadow-xs">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <span className="font-display text-sm tracking-wider uppercase text-[#151515] font-bold mt-2.5 group-hover:text-black line-clamp-1">
                {cat.name}
              </span>
              <span className="font-mono text-[10px] text-[#777777] uppercase line-clamp-1">
                {cat.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
