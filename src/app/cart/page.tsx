"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const freeShippingThreshold = 1499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) {
      setCouponInput("");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-[#777777] mx-auto mb-4 stroke-1" />
        <h1 className="font-display text-4xl sm:text-5xl uppercase font-black text-[#151515] mb-2">
          YOUR SHOPPING BAG IS EMPTY
        </h1>
        <p className="text-sm text-[#777777] mb-8 max-w-md mx-auto">
          Explore our latest heavyweight streetwear drops and limited-edition graphic tees.
        </p>
        <Link
          href="/shop"
          className="bg-[#101010] text-[#D8FF36] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors inline-block"
        >
          EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-screen">
      <div className="border-b border-[#D4D0C8] pb-6 mb-8 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
            SHOPPING CART
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515]">
            YOUR BAG ({cart.reduce((s, i) => s + i.quantity, 0)} ITEMS)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-mono uppercase text-red-600 hover:underline"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="bg-[#E8E5DE] p-4 border border-[#D4D0C8]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#151515] mb-2">
              {amountNeeded > 0 ? (
                <span>
                  ADD <strong>{formatPrice(amountNeeded)}</strong> MORE FOR FREE EXPRESS SHIPPING
                </span>
              ) : (
                <span className="text-green-800 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-700" /> FREE SHIPPING UNLOCKED
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-[#D4D0C8]">
              <div
                className="h-full bg-[#101010] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-[#D4D0C8] border-y border-[#D4D0C8]">
            {cart.map((item) => (
              <div key={item.variantId} className="py-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                {/* Product thumbnail & basic info */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-26 bg-[#E8E5DE] border border-[#D4D0C8] overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold uppercase tracking-tight text-[#151515] hover:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs font-mono text-[#777777] mt-1 space-x-2">
                      <span>FIT: {item.size}</span>
                      <span>•</span>
                      <span>COLOR: {item.color}</span>
                    </div>
                    <div className="text-xs font-mono text-[#151515] font-bold mt-1">
                      {formatPrice(item.price)} each
                    </div>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#151515] bg-[#E8E5DE]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-xs font-bold text-[#151515] hover:bg-[#D4D0C8]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-mono font-bold text-[#151515]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-xs font-bold text-[#151515] hover:bg-[#D4D0C8]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-base font-black text-[#151515]">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-[#777777] hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link
              href="/shop"
              className="font-bold uppercase tracking-wider text-[#151515] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 space-y-4">
            <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
              ORDER SUMMARY
            </h2>

            {/* Promo Code Form */}
            <div className="pt-2">
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="COUPON (e.g. BUILD10)"
                    className="flex-1 bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs font-mono uppercase text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                  <button
                    type="submit"
                    className="bg-[#101010] text-[#D8FF36] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-[#F5F3EE] p-2.5 border border-[#101010]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#151515]">
                    <Tag className="w-4 h-4 text-green-700" />
                    <span>COUPON: {coupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponMsg && (
                <p className={`text-[11px] mt-1.5 ${couponMsg.error ? "text-red-600" : "text-green-700 font-semibold"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2 text-xs font-mono pt-4 border-t border-[#D4D0C8]">
              <div className="flex justify-between text-[#555555]">
                <span>SUBTOTAL</span>
                <span className="font-bold text-[#151515]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>DISCOUNT</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555555]">
                <span>SHIPPING</span>
                <span className="font-bold text-[#151515]">
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#151515] pt-3 border-t border-[#D4D0C8]">
                <span>ESTIMATED TOTAL</span>
                <span className="text-xl font-display">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-4 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border border-[#101010]"
            >
              <span>CHECKOUT SECURELY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-[#777777]">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span>256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

