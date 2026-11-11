"use client";

import React from "react";
import { ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StickyMobileAddToCartProps {
  title: string;
  price: number;
  selectedSize: string;
  isOutOfStock: boolean;
  onAddToCart: () => void;
  added: boolean;
}

export default function StickyMobileAddToCart({
  title,
  price,
  selectedSize,
  isOutOfStock,
  onAddToCart,
  added,
}: StickyMobileAddToCartProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-[#F5F3EE]/95 backdrop-blur-md border-t border-[#D4D0C8] p-3 z-40 md:hidden flex items-center justify-between shadow-2xl">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-[#777777] uppercase truncate max-w-[140px]">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-black text-[#151515] font-mono">
            {formatPrice(price)}
          </span>
          <span className="text-[10px] font-mono font-bold bg-[#E8E5DE] px-1.5 py-0.5 text-[#151515]">
            FIT: {selectedSize}
          </span>
        </div>
      </div>

      <button
        onClick={onAddToCart}
        disabled={isOutOfStock}
        className="px-5 py-2.5 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:bg-gray-400"
      >
        {added ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>ADDED</span>
          </>
        ) : isOutOfStock ? (
          <span>OUT OF STOCK</span>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </>
        )}
      </button>
    </div>
  );
}

