"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
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

  if (!isCartDrawerOpen) return null;

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

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F3EE] shadow-2xl flex flex-col border-l border-[#151515]">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E5DE] flex items-center justify-between bg-[#F5F3EE]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#151515]" />
              <h2 className="font-display text-2xl uppercase tracking-wider text-[#151515] font-bold">
                YOUR BAG ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-[#151515] hover:bg-[#E8E5DE] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#E8E5DE] px-5 py-3 border-b border-[#D4D0C8]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#151515] mb-1.5">
              {amountNeeded > 0 ? (
                <span>
                  ADD <strong className="text-[#101010]">{formatPrice(amountNeeded)}</strong> MORE FOR FREE EXPRESS SHIPPING
                </span>
              ) : (
                <span className="text-[#101010] flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-green-600 inline" /> YOU HAVE UNLOCKED FREE EXPRESS SHIPPING!
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-[#D4D0C8] rounded-none overflow-hidden">
              <div
                className="h-full bg-[#101010] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8E5DE]">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-[#777777] mb-3 stroke-1" />
                <p className="font-display text-2xl uppercase tracking-wider text-[#151515] mb-1">
                  YOUR BAG IS EMPTY
                </p>
                <p className="text-xs text-[#777777] mb-6">
                  Don&apos;t sleep on the latest drop.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#101010] text-[#D8FF36] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  EXPLORE DROPS
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-26 flex-shrink-0 bg-[#E8E5DE] overflow-hidden border border-[#D4D0C8]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-bold uppercase tracking-tight text-[#151515] hover:underline line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-[#777777] hover:text-red-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-[#777777] mt-1 space-x-2">
                        <span>SIZE: {item.size}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#151515] bg-[#E8E5DE]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-[#151515] hover:bg-[#D4D0C8] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-mono font-bold text-[#151515]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-[#151515] hover:bg-[#D4D0C8] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-sm font-black text-[#151515]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#D4D0C8] bg-[#F5F3EE] space-y-3">
              {/* Promo Code Input */}
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. BUILD10)"
                    className="flex-1 bg-[#E8E5DE] border border-[#D4D0C8] px-3 py-2 text-xs font-mono uppercase text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                  <button
                    type="submit"
                    className="bg-[#151515] text-[#D8FF36] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-[#E8E5DE] p-2 border border-[#D8FF36]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#151515]">
                    <Tag className="w-3.5 h-3.5 text-green-700" />
                    <span>CODE: {coupon.code}</span>
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
                <p className={`text-[11px] ${couponMsg.error ? "text-red-600" : "text-green-700 font-semibold"}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-[#555555] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#151515]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#151515]">
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#151515] pt-2 border-t border-[#D4D0C8]">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border border-[#101010]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#777777] hover:text-[#151515] hover:underline"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

