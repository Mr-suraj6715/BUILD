import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | BUILD CLOTHING",
  description: "7-day hassle-free returns and size exchanges for BUILD CLOTHING garments.",
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
        CUSTOMER PROTECTION
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        RETURNS & EXCHANGES
      </h1>

      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-8 text-xs font-mono leading-relaxed text-[#333333]">
        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            1. 7-DAY HASSLE-FREE RETURN WINDOW
          </h2>
          <p>
            We stand behind our 240+ GSM craftsmanship. If your garment does not fit the way you want, or if you received an incorrect item, you can initiate a return or exchange within <strong>7 days of delivery</strong> directly from your <Link href="/account" className="underline font-bold text-[#151515]">Customer Account Dashboard</Link>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            2. ELIGIBILITY CRITERIA
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The garment must be unworn, unwashed, and with all original brand tags attached.</li>
            <li>Original packaging and polybag must be returned in good condition.</li>
            <li>Limited numbered drop items with certificates of authenticity must include the certificate.</li>
            <li>Items damaged due to customer misuse or improper washing (e.g. ironing directly on rubberized high-density prints) are not eligible.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515]">
            3. REVERSE PICKUP & REFUND PROCESS
          </h2>
          <p>
            Once a return request is submitted, our courier partner will arrange a doorstep pickup within 48–72 hours.
          </p>
          <p>
            Upon receipt and standard quality inspection at our Mumbai warehouse:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Prepaid Orders (Razorpay UPI / Cards):</strong> Refund is credited directly to the original payment source within 3–5 business days.
            </li>
            <li>
              <strong>Cash on Delivery (COD):</strong> Refund is issued via direct bank transfer (NEFT/IMPS) or instant store credits per your preference.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

