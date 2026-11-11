import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | BUILD CLOTHING",
  description: "Express shipping timelines, courier partners, and free shipping terms for BUILD CLOTHING.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#777777] hover:text-[#151515] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase block">
        FULFILLMENT STANDARDS
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        SHIPPING & DELIVERY
      </h1>

      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-8 text-xs font-mono leading-relaxed text-[#333333]">
        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            1. DISPATCH & TIMELINES
          </h2>
          <p>
            All standard releases and drops are processed, quality-inspected, and dispatched from our Mumbai warehouse within 24–48 hours of order confirmation (excluding Sundays and national holidays).
          </p>
          <p>
            For exclusive numbered drops and pre-orders, estimated shipping dates are explicitly specified on the product page and checkout receipt.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            2. DELIVERY TRANSIT TIMES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#F5F3EE] p-4 border border-[#D4D0C8]">
              <strong className="block text-sm text-[#151515]">METRO CITIES</strong>
              <span className="text-[#777777] mt-1 block">2–3 Business Days</span>
              <span className="text-[10px] text-[#555555]">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata</span>
            </div>
            <div className="bg-[#F5F3EE] p-4 border border-[#D4D0C8]">
              <strong className="block text-sm text-[#151515]">REST OF INDIA</strong>
              <span className="text-[#777777] mt-1 block">3–5 Business Days</span>
              <span className="text-[10px] text-[#555555]">Tier 2 & Tier 3 cities across all serviceable PIN codes</span>
            </div>
            <div className="bg-[#F5F3EE] p-4 border border-[#D4D0C8]">
              <strong className="block text-sm text-[#151515]">REMOTE REGIONS</strong>
              <span className="text-[#777777] mt-1 block">5–7 Business Days</span>
              <span className="text-[10px] text-[#555555]">Special transit zones via air speed post</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            3. SHIPPING RATES & FREE THRESHOLDS
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>FREE Express Shipping</strong> on all domestic prepaid & COD orders of <strong>₹1,499 or more</strong>.
            </li>
            <li>
              A flat nominal shipping fee of <strong>₹99</strong> applies to orders below ₹1,499.
            </li>
            <li>No additional surcharge for Cash on Delivery (COD) orders.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            4. COURIER PARTNERS & LIVE TRACKING
          </h2>
          <p>
            We partner with premier logistics networks including <strong>Delhivery Express</strong> and <strong>BlueDart</strong>. As soon as your streetwear is dispatched, an Air Waybill (AWB) number and live tracking link will be sent via SMS and Email.
          </p>
          <div className="pt-2">
            <Link
              href="/track"
              className="inline-block bg-[#101010] text-[#D8FF36] px-5 py-2.5 font-bold uppercase tracking-wider hover:bg-black"
            >
              Track Your Package Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

