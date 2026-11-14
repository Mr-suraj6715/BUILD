"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  product: {
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
    images: { url: string; alt: string; isPrimary: boolean }[];
    variants?: {
      id: string;
      size: string;
      color: string;
      colorHex: string;
      stock: number;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.[0]?.color || ""
  );
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2400&q=95";

  const secondaryImage =
    product.images?.[1]?.url || primaryImage;

  // Calculate discount percentage
  const discountPercent =
    product.originalPrice > product.basePrice
      ? Math.round(
          ((product.originalPrice - product.basePrice) / product.originalPrice) * 100
        )
      : null;

  // Available unique sizes and colors
  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size) || ["S", "M", "L", "XL"])
  );
  const availableColors = Array.from(
    new Map(
      (product.variants || []).map((v) => [v.color, { color: v.color, hex: v.colorHex }])
    ).values()
  );

  // Total stock check
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 20;
  const isSoldOut = totalStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const matchingVariant = product.variants?.find(
      (v) =>
        v.size === selectedSize &&
        (!selectedColor || v.color === selectedColor)
    ) || product.variants?.[0];

    if (!matchingVariant || matchingVariant.stock <= 0) return;

    addToCart({
      variantId: matchingVariant.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: primaryImage,
      price: product.basePrice,
      originalPrice: product.originalPrice,
      size: matchingVariant.size,
      color: matchingVariant.color,
      quantity: 1,
      maxStock: matchingVariant.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E8E5DE] border border-[#D4D0C8]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-[#101010] text-[#777777] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
              SOLD OUT
            </span>
          ) : (
            <>
              {product.isNewDrop && (
                <span className="bg-[#D8FF36] text-[#101010] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  NEW DROP
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-[#101010] text-[#F5F3EE] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  BESTSELLER
                </span>
              )}
              {product.isLimited && (
                <span className="bg-[#151515] text-[#D8FF36] border border-[#D8FF36]/40 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  LIMITED
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-[#F5F3EE]/90 hover:bg-[#F5F3EE] text-[#151515] rounded-none border border-[#D4D0C8] transition-colors"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-600 text-red-600" : "text-[#151515]"
            }`}
          />
        </button>

        {/* Link to detail page */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Quick Add Overlay on Hover (Desktop) */}
        {!isSoldOut && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 z-20">
            {/* Quick Size Pills */}
            <div className="flex items-center justify-center gap-1.5">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`w-7 h-7 text-[11px] font-bold flex items-center justify-center transition-colors ${
                    selectedSize === size
                      ? "bg-[#D8FF36] text-[#101010]"
                      : "bg-[#101010]/80 text-[#F5F3EE] hover:bg-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#D8FF36]/20"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>QUICK ADD ({selectedSize})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-2 flex flex-col flex-grow">
        {/* GSM / Fit spec */}
        <div className="flex items-center justify-between text-[11px] text-[#777777] uppercase font-mono tracking-wider mb-1">
          <span>{product.gsm} GSM</span>
          <span>{product.fit}</span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-bold uppercase tracking-tight text-[#151515] group-hover:underline line-clamp-1"
        >
          {product.title}
        </Link>

        {/* Color swatches preview if available */}
        {availableColors.length > 1 && (
          <div className="flex items-center gap-1.5 my-1.5">
            {availableColors.map((c) => (
              <span
                key={c.color}
                title={c.color}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        {/* Price & Discount */}
        <div className="mt-auto pt-1 flex items-baseline gap-2">
          <span className="text-sm font-black text-[#151515]">
            {formatPrice(product.basePrice)}
          </span>
          {product.originalPrice > product.basePrice && (
            <>
              <span className="text-xs text-[#777777] line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[11px] font-bold text-[#101010] bg-[#D8FF36] px-1">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

