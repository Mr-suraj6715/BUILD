import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | BUILD CLOTHING",
  description: "Terms of service and commercial agreement for BUILD CLOTHING.",
};

export default function TermsPage() {
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
        COMMERCIAL AGREEMENT
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        TERMS OF SERVICE
      </h1>

      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-6 text-xs font-mono leading-relaxed text-[#333333]">
        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            1. ACCEPTANCE OF TERMS
          </h2>
          <p>
            By accessing or purchasing from BUILD CLOTHING (&quot;buildclothing.com&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using our services.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            2. INTELLECTUAL PROPERTY & ORIGINAL ARTWORK
          </h2>
          <p>
            All streetwear apparel designs, typography compositions, cyberpunk illustrations, brand logos, and graphic prints published on this website are original creative works owned exclusively by BUILD CLOTHING or licensed from respective collaborating independent artists. Unauthorized reproduction or commercial resale is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            3. PRICING & ORDER VALIDATION
          </h2>
          <p>
            All prices displayed are in Indian Rupees (INR) and include applicable taxes (GST). We reserve the right to correct typographical pricing errors before shipment. All orders are validated server-side to prevent client pricing tampering.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            4. JURISDICTION
          </h2>
          <p>
            These terms are governed by the laws of India. Any legal disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
          </p>
        </div>
      </div>
    </div>
  );
}

