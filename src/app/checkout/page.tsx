"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, shippingFee, total, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);
    setCouponMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setCouponInput("");
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl uppercase font-bold text-[#151515] mb-2">
          NO ITEMS TO CHECKOUT
        </h2>
        <p className="text-xs text-[#777777] mb-6">
          Your shopping bag is currently empty.
        </p>
        <Link
          href="/shop"
          className="bg-[#101010] text-[#D8FF36] px-6 py-3 text-xs font-bold uppercase tracking-widest inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      setErrorMessage("Please complete all required shipping fields.");
      return;
    }

    if (formData.pincode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create Order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          shippingAddress: formData,
          paymentMethod,
          couponCode: coupon?.code,
          guestEmail: formData.email,
          guestPhone: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order creation failed.");
      }

      const { orderNumber, isCOD, razorpayOrder } = data;

      // If Cash on delivery, order is immediately confirmed
      if (isCOD) {
        clearCart();
        router.push(`/order-success/${orderNumber}`);
        return;
      }

      // Step 2: Handle Razorpay Online Payment Flow
      // Check if Razorpay SDK exists or handle verification
      const verifyRes = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          razorpayOrderId: razorpayOrder?.id || "order_mock_" + Date.now(),
          razorpayPaymentId: "pay_mock_" + Math.random().toString(36).substring(2, 10),
          razorpaySignature: "mock_signature_valid",
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("Payment verification failed. Please try again.");
      }

      clearCart();
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while placing order.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-screen">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#777777] hover:text-[#151515] mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Bag</span>
        </Link>
        <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515]">
          SECURE CHECKOUT
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Customer & Address Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Details */}
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6">
            <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-4">
              1. CONTACT INFORMATION
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Mobile Number (For Courier SMS & Tracking) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6">
            <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-4">
              2. DELIVERY ADDRESS
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Flat, House no., Building, Company, Apartment *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Flat 304, Tower B, Oberoi Springs"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Area, Street, Sector, Village (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="New Link Road, Andheri West"
                  className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400053"
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-medium text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6">
            <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-4">
              3. PAYMENT METHOD
            </h2>
            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  paymentMethod === "RAZORPAY"
                    ? "bg-[#F5F3EE] border-[#101010] ring-1 ring-[#101010]"
                    : "bg-[#E8E5DE] border-[#D4D0C8] hover:border-[#151515]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#151515]">
                      Razorpay Online Payment (UPI, Cards, NetBanking)
                    </span>
                    <span className="text-[10px] font-bold bg-[#D8FF36] text-[#101010] px-2 py-0.5 uppercase">
                      FASTEST
                    </span>
                  </div>
                  <p className="text-[11px] text-[#777777] mt-1">
                    Pay securely using Google Pay, PhonePe, Paytm, Credit / Debit cards, or Net Banking.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "bg-[#F5F3EE] border-[#101010] ring-1 ring-[#101010]"
                    : "bg-[#E8E5DE] border-[#D4D0C8] hover:border-[#151515]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#151515]">
                      Cash on Delivery (COD)
                    </span>
                    <Truck className="w-4 h-4 text-[#151515]" />
                  </div>
                  <p className="text-[11px] text-[#777777] mt-1">
                    Pay in cash when your streetwear arrives at your doorstep. Verified OTP upon delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 space-y-4 sticky top-28">
            <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
              ITEMS IN BAG ({cart.length})
            </h2>

            {/* Cart Items Preview */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#D4D0C8] pr-2">
              {cart.map((item) => (
                <div key={item.variantId} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-16 object-cover bg-white flex-shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold uppercase text-[#151515] truncate">
                      {item.title}
                    </h4>
                    <p className="font-mono text-[#777777] text-[10px]">
                      SIZE: {item.size} • QTY: {item.quantity}
                    </p>
                    <span className="font-bold text-[#151515] font-mono">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input & Details */}
            <div className="pt-3 border-t border-[#D4D0C8]">
              <label className="block text-[11px] font-mono uppercase text-[#555555] mb-1.5 font-bold">
                HAVE A PROMO CODE?
              </label>
              {!coupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="e.g. SURAJ300, BUILD10"
                    className="flex-1 bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-xs font-mono uppercase text-[#151515] focus:outline-none focus:border-[#151515]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={couponLoading}
                    className="bg-[#101010] text-[#D8FF36] hover:bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? "..." : "APPLY"}
                  </button>
                </div>
              ) : (
                <div className="bg-[#F5F3EE] border border-[#101010] p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#151515]">
                      <Tag className="w-3.5 h-3.5 text-green-700" />
                      <span>CODE: {coupon.code}</span>
                      <span className="bg-[#D8FF36] text-[#101010] text-[10px] px-1.5 py-0.5 font-bold uppercase">
                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setCouponMessage(null);
                      }}
                      className="text-xs text-red-600 hover:underline font-semibold font-mono"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-green-700 font-semibold">
                    Discount applied: -{formatPrice(discount)}
                  </div>
                </div>
              )}

              {couponMessage && (
                <div
                  className={`mt-2 p-2 font-mono text-xs ${
                    couponMessage.error
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-800 border border-green-300 font-semibold"
                  }`}
                >
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs font-mono pt-4 border-t border-[#D4D0C8]">
              <div className="flex justify-between text-[#555555]">
                <span>SUBTOTAL</span>
                <span className="font-bold text-[#151515]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>DISCOUNT ({coupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555555]">
                <span>EXPRESS SHIPPING</span>
                <span className="font-bold text-[#151515]">
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#151515] pt-3 border-t border-[#D4D0C8]">
                <span>TOTAL DUE</span>
                <span className="text-2xl font-display">{formatPrice(total)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#101010] text-[#D8FF36] hover:bg-[#D8FF36] hover:text-[#101010] text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border border-[#101010] disabled:bg-gray-400"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? "PROCESSING ORDER..." : "PLACE ORDER NOW"}</span>
            </button>

            <div className="pt-2 text-[11px] font-mono text-[#777777] text-center">
              By placing your order, you agree to BUILD CLOTHING Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

