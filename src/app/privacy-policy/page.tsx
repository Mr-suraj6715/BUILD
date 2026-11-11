import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BUILD CLOTHING",
  description: "Privacy policy, data security, and encryption standards for BUILD CLOTHING.",
};

export default function PrivacyPolicyPage() {
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
        DATA INTEGRITY
      </span>
      <h1 className="font-display text-4xl sm:text-6xl uppercase font-black tracking-tight text-[#151515] mt-1 mb-8">
        PRIVACY POLICY
      </h1>

      <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 sm:p-8 space-y-6 text-xs font-mono leading-relaxed text-[#333333]">
        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            1. INFORMATION WE COLLECT
          </h2>
          <p>
            When you purchase garments from BUILD CLOTHING, we collect customer identification data including your name, email address, contact phone number, and delivery address. This data is strictly used for order processing, logistics dispatch via our verified courier network, and transactional status notifications.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            2. ZERO RAW CARD RETENTION
          </h2>
          <p>
            We do not store your credit/debit card numbers or UPI PINs. All payment transactions are processed through Razorpay using industry-standard PCI-DSS Level 1 compliant tokenization and 256-bit encryption.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            3. COOKIES & SESSIONS
          </h2>
          <p>
            We utilize secure, HTTP-only authentication cookies (`bld_token`) to maintain your authenticated login session and customer dashboard. No personal data is sold or shared with third-party advertising brokers.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl uppercase font-bold text-[#151515] mb-2">
            4. CONTACT OUR PRIVACY OFFICER
          </h2>
          <p>
            For inquiries regarding your saved addresses or data deletion requests, contact our privacy desk at <a href="mailto:privacy@buildclothing.com" className="underline font-bold text-[#151515]">privacy@buildclothing.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

