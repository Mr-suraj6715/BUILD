import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "No Return & Exchange Policy | BUILD CLOTHING",
  description: "BUILD CLOTHING strict No Return, No Exchange, and Final Sale policy.",
};

export default function ReturnPolicyPage() {
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
        STORE POLICY // TERMS OF PURCHASE
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        NO RETURN & NO EXCHANGE POLICY
      </h1>

      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-8 text-xs font-mono leading-relaxed text-[#333333]">
        <div className="bg-[#151515] text-[#F5F3EE] p-5 border-l-4 border-[#D8FF36] space-y-2">
          <div className="flex items-center gap-2 text-[#D8FF36] font-bold uppercase tracking-wider text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>ALL SALES ARE FINAL</span>
          </div>
          <p className="text-xs text-[#CCCCCC]">
            BUILD CLOTHING does not offer returns, exchanges, or refunds on any garments, hoodies, t-shirts, or bespoke custom printed merchandise. Please review your order and size measurements carefully before completing your purchase.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            1. STRICT NO RETURN & NO EXCHANGE FACILITY
          </h2>
          <p>
            Due to the exclusive limited-run drops, premium heavyweight 240+ GSM Japanese combed cotton milling, and made-to-order bespoke nature of our Custom Print Studio apparel, we operate on a strict <strong>Final Sale</strong> basis.
          </p>
          <p>
            We do not accept returns or process size exchanges for any reason, including change of mind, personal preference, or ordering an incorrect size.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            2. ACCURATE SIZE SELECTION
          </h2>
          <p>
            To ensure the desired boxy or relaxed streetwear drape, comprehensive dimensional size charts (Chest, Length, Shoulder Width, Sleeve Length) are provided on every product page. Customers are encouraged to consult our size charts or reach out to our team at{" "}
            <a href="mailto:buildclothing2026@gmail.com" className="underline font-bold text-[#151515]">
              buildclothing2026@gmail.com
            </a>{" "}
            prior to purchasing.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            3. TRANSIT DAMAGE OR INCORRECT SHIPMENT
          </h2>
          <p>
            In the rare event that your package arrives physically damaged in transit or you receive a completely incorrect item from our warehouse:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              You must report the issue within <strong>48 hours of delivery</strong> by emailing{" "}
              <strong>buildclothing2026@gmail.com</strong>.
            </li>
            <li>
              Include your order number (e.g. <code>BLD-2505-8821</code>), high-resolution photos of the parcel label, and a complete unboxing video showing the sealed courier package being opened.
            </li>
            <li>
              Upon verification by our fulfillment team, a replacement piece of the exact same product and size will be dispatched at no additional cost.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            4. ORDER CANCELLATIONS
          </h2>
          <p>
            Orders can only be cancelled while in <strong>PENDING</strong> status before payment capture and processing. Once an order enters our automated cut, print, or dispatch pipeline, it cannot be modified or cancelled.
          </p>
        </div>
      </div>
    </div>
  );
}
