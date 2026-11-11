"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Instagram, Twitter, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      setSubscribed(true);
      setNewsletterEmail("");
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#101010] text-[#F5F3EE] border-t border-[#262626]">
      {/* Top Banner with Newsletter */}
      <div className="border-b border-[#262626] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-bold tracking-mega text-[#D8FF36] uppercase">
              JOIN THE UNDERGROUND
            </span>
            <h3 className="font-display text-3xl sm:text-5xl uppercase font-black tracking-wide text-[#F5F3EE] mt-2 mb-3">
              NEVER MISS A DROP.
            </h3>
            <p className="text-sm text-[#777777] max-w-lg leading-relaxed">
              Sign up for private drop alerts, unannounced capsule releases, and exclusive archive sales. No spam, only substance.
            </p>
          </div>

          <div className="lg:col-span-5">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-[#181818] border border-[#333333] px-4 py-3.5 text-sm text-[#F5F3EE] placeholder:text-[#777777] focus:outline-none focus:border-[#D8FF36] flex-grow"
                />
                <button
                  type="submit"
                  className="bg-[#D8FF36] text-[#101010] px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            ) : (
              <div className="p-4 bg-[#181818] border border-[#D8FF36]/40 text-xs text-[#D8FF36] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>You are on the list. 10% coupon code: <strong>BUILD10</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
        {/* Brand identity column */}
        <div className="col-span-2 lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-display text-4xl tracking-wider uppercase font-black text-[#F5F3EE]">
              BUILD<span className="text-[#D8FF36]">.</span>
            </span>
          </Link>
          <p className="text-xs text-[#777777] max-w-sm leading-relaxed">
            BUILD CLOTHING is a premium independent streetwear label engineered for Gen Z and modern pop-culture communities. 240+ GSM heavyweight combed cotton, custom boxy silhouettes, and uncompromising original design.
          </p>
          <div className="pt-2 text-xs font-mono text-[#555555] space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D8FF36]" />
              <span>Flagship: Bandra West, Mumbai, Maharashtra 400050</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D8FF36]" />
              <span>support@buildclothing.com</span>
            </div>
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D8FF36]">
            T-SHIRT CATALOG
          </h4>
          <ul className="space-y-2 text-xs text-[#AAAAAA]">
            <li>
              <Link href="/shop?category=all-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                All T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=oversized-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                Oversized T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=graphic-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                Graphic T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=custom-printed-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                Custom Printed T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=minimal-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                Minimal T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=limited-edition-t-shirts" className="hover:text-[#F5F3EE] transition-colors">
                Limited Edition T-Shirts
              </Link>
            </li>
          </ul>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D8FF36]">
            COLLECTIONS
          </h4>
          <ul className="space-y-2 text-xs text-[#AAAAAA]">
            <li>
              <Link href="/shop?collection=oversized-edit" className="hover:text-[#F5F3EE] transition-colors">
                The Oversized Edit
              </Link>
            </li>
            <li>
              <Link href="/shop?collection=graphic-universe" className="hover:text-[#F5F3EE] transition-colors">
                Graphic Universe
              </Link>
            </li>
            <li>
              <Link href="/shop?collection=everyday-essentials" className="hover:text-[#F5F3EE] transition-colors">
                Everyday Essentials
              </Link>
            </li>
            <li>
              <Link href="/shop?collection=limited-drops" className="hover:text-[#F5F3EE] transition-colors">
                Numbered Runs
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-[#F5F3EE] transition-colors">
                Live Shipment Tracking
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D8FF36]">
            CUSTOMER CARE
          </h4>
          <ul className="space-y-2 text-xs text-[#AAAAAA]">
            <li>
              <Link href="/shipping-policy" className="hover:text-[#F5F3EE] transition-colors">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-[#F5F3EE] transition-colors">
                7-Day Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#F5F3EE] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#F5F3EE] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#F5F3EE] transition-colors">
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#262626] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>© {new Date().getFullYear()} BUILD CLOTHING CO. ALL RIGHTS RESERVED. CRAFTED FOR THE CULTURE.</p>
          <div className="flex items-center space-x-6">
            <span className="text-[11px] font-mono text-[#555555]">PAYMENTS SECURED BY RAZORPAY / COD</span>
            <div className="flex space-x-4 text-[#AAAAAA]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D8FF36]">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D8FF36]">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

