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
  Upload,
  Trash2,
  Check,
  QrCode,
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

  const [paymentMethod, setPaymentMethod] = useState<"UPI_QR" | "COD">("UPI_QR");
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const screenshotInputRef = React.useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side screenshot processor with lightweight image compression
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setPaymentScreenshot(compressedDataUrl);
        setScreenshotFileName(file.name);
        setErrorMessage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

    // Require payment screenshot or UTR number if UPI QR is selected
    if (paymentMethod === "UPI_QR" && !paymentScreenshot && !utrNumber.trim()) {
      setErrorMessage("Please upload your Google Pay / UPI payment screenshot or enter the UTR reference number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create Order on server with payment proof
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            title: i.title,
            size: i.size,
            color: i.color,
            price: i.price,
            image: i.image,
            isCustom: i.variantId?.startsWith("custom-") || i.slug === "custom-print",
          })),
          shippingAddress: {
            ...formData,
            paymentScreenshot: paymentScreenshot || null,
            utrNumber: utrNumber.trim() || null,
          },
          paymentMethod,
          couponCode: coupon?.code,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          paymentScreenshot: paymentScreenshot || null,
          utrNumber: utrNumber.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order creation failed.");
      }

      const { orderNumber } = data;

      // Order created successfully!
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
          <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
                3. PAYMENT METHOD
              </h2>
              <span className="font-mono text-[10px] text-[#555555] uppercase font-bold">
                Instant & Direct UPI
              </span>
            </div>

            <div className="space-y-4">
              {/* Google Pay / UPI QR Code (Primary) */}
              <div
                className={`border transition-all ${
                  paymentMethod === "UPI_QR"
                    ? "bg-[#F5F3EE] border-[#101010] ring-1 ring-[#101010]"
                    : "bg-[#E8E5DE] border-[#D4D0C8] hover:border-[#151515]"
                }`}
              >
                <label className="flex items-start gap-3 p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI_QR"
                    checked={paymentMethod === "UPI_QR"}
                    onChange={() => setPaymentMethod("UPI_QR")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#151515] flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#151515]" />
                        <span>Google Pay / UPI QR Code Payment</span>
                      </span>
                      <span className="text-[10px] font-bold bg-[#D8FF36] text-[#101010] px-2 py-0.5 uppercase tracking-wide">
                        RECOMMENDED • 0% FEES
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1">
                      Scan our official Google Pay QR code to pay instantly with GPay, PhonePe, Paytm, or any UPI app.
                    </p>
                  </div>
                </label>

                {/* EXPANDABLE QR & SCREENSHOT UPLOAD SECTION */}
                {paymentMethod === "UPI_QR" && (
                  <div className="p-4 sm:p-6 border-t border-[#D4D0C8] bg-white space-y-5">
                    {/* Amount Banner */}
                    <div className="bg-[#101010] text-[#F5F3EE] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                      <div>
                        <span className="text-[10px] uppercase text-[#AAAAAA] block">Total Amount to Pay</span>
                        <span className="text-2xl sm:text-3xl font-display font-black text-[#D8FF36]">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[10px] text-[#AAAAAA] block uppercase">Receiver UPI ID</span>
                        <span className="text-xs text-white font-bold">surajyadav67150@okicici</span>
                      </div>
                    </div>

                    {/* QR Code Presentation Box */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-5 bg-[#FBF9F4] border border-[#E0DCD3]">
                      {/* QR Image Frame */}
                      <div className="relative shrink-0 w-52 sm:w-60 aspect-square bg-white p-3 border-2 border-[#101010] shadow-md flex flex-col items-center justify-center">
                        <img
                          src="/images/payment/gpay_qr.jpg"
                          alt="Google Pay QR Code - Suraj Yadav"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Step-by-Step Payment Instructions */}
                      <div className="flex-1 space-y-3 font-mono text-xs w-full">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#777] uppercase font-bold tracking-wider">RECIPIENT NAME</span>
                          <p className="font-bold text-sm text-[#151515]">Suraj Yadav</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-[#777] uppercase font-bold tracking-wider">UPI ID</span>
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="bg-[#E8E5DE] px-2.5 py-1.5 text-xs font-bold text-[#101010] border border-[#D4D0C8] select-all">
                              surajyadav67150@okicici
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("surajyadav67150@okicici");
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2000);
                              }}
                              className="px-2.5 py-1.5 bg-[#101010] text-[#D8FF36] hover:bg-black font-mono text-[10px] font-bold uppercase transition-colors"
                            >
                              {copiedUpi ? "COPIED!" : "COPY UPI ID"}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#EAE6DF] space-y-1.5 text-[11px] text-[#555]">
                          <p className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-[#101010] text-[#D8FF36] rounded-full flex items-center justify-center text-[9px] font-bold">1</span>
                            Scan with GPay, PhonePe, Paytm, or BHIM UPI
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-[#101010] text-[#D8FF36] rounded-full flex items-center justify-center text-[9px] font-bold">2</span>
                            Pay exact amount <strong>{formatPrice(total)}</strong>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-[#101010] text-[#D8FF36] rounded-full flex items-center justify-center text-[9px] font-bold">3</span>
                            Upload screenshot of your payment receipt below
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Upload Field */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono uppercase font-bold text-[#151515]">
                          INSERT / UPLOAD PAYMENT SCREENSHOT *
                        </label>
                        {paymentScreenshot && (
                          <span className="text-[10px] font-mono text-green-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Receipt Attached
                          </span>
                        )}
                      </div>

                      <input
                        ref={screenshotInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />

                      {paymentScreenshot ? (
                        <div className="border border-[#151515] bg-[#FBF9F4] p-3 flex items-center gap-4">
                          <img
                            src={paymentScreenshot}
                            alt="Payment receipt preview"
                            className="w-16 h-20 object-cover border border-[#D4D0C8] bg-white shrink-0"
                          />
                          <div className="flex-1 min-w-0 font-mono">
                            <p className="text-xs font-bold text-[#151515] truncate">
                              {screenshotFileName || "payment_receipt.jpg"}
                            </p>
                            <p className="text-[10px] text-green-700 font-bold mt-0.5">
                              Receipt ready for order verification
                            </p>
                            <button
                              type="button"
                              onClick={() => screenshotInputRef.current?.click()}
                              className="mt-2 text-[10px] uppercase font-bold text-[#151515] underline hover:text-black"
                            >
                              Change Screenshot
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentScreenshot(null);
                              setScreenshotFileName(null);
                              if (screenshotInputRef.current) screenshotInputRef.current.value = "";
                            }}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Remove screenshot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => screenshotInputRef.current?.click()}
                          className="border-2 border-dashed border-[#C5BFB5] hover:border-black p-6 text-center cursor-pointer transition-colors bg-[#FBF9F4]"
                        >
                          <Upload className="w-8 h-8 mx-auto mb-2 text-[#666666]" />
                          <span className="font-mono text-xs font-bold uppercase text-[#151515] block">
                            Tap / Click to insert payment screenshot
                          </span>
                          <span className="font-mono text-[10px] text-[#777777] block mt-1">
                            Supports JPG, PNG, WebP (Receipt from Google Pay, PhonePe, Paytm, etc.)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Optional UTR / Reference ID Field */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-mono uppercase font-bold text-[#555555]">
                        UPI Ref / 12-Digit UTR Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 432198765432"
                        className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-2.5 text-xs font-mono text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                      <span className="text-[10px] font-mono text-[#777777] block">
                        Found on your Google Pay receipt under &quot;UPI transaction ID&quot; or &quot;UTR&quot;.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cash On Delivery */}
              <div
                className={`border transition-all ${
                  paymentMethod === "COD"
                    ? "bg-[#F5F3EE] border-[#101010] ring-1 ring-[#101010]"
                    : "bg-[#E8E5DE] border-[#D4D0C8] hover:border-[#151515]"
                }`}
              >
                <label className="flex items-start gap-3 p-4 cursor-pointer">
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

