"use client";

import React from "react";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export default function TrustPerks() {
  const perks = [
    {
      icon: Award,
      title: "240+ GSM HEAVYWEIGHT",
      desc: "Zero-sag ribbed collar & pre-shrunk Japanese combed cotton.",
    },
    {
      icon: Truck,
      title: "FREE EXPRESS DELIVERY",
      desc: "Complimentary shipping across India on orders above ₹1,499.",
    },
    {
      icon: RotateCcw,
      title: "7-DAY EASY EXCHANGES",
      desc: "Doorstep reverse pickup with instant size swap or full refund.",
    },
    {
      icon: ShieldCheck,
      title: "1200 DPI KORNIT PRINTS",
      desc: "Industrial pigment inks that never peel, crack, or fade.",
    },
  ];

  return (
    <section className="w-full bg-[#151515] text-[#F5F3EE] py-10 border-y border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-[#262626] border border-[#333333] flex items-center justify-center shrink-0 text-[#D8FF36]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
                    {p.title}
                  </h4>
                  <p className="font-sans text-[11px] text-[#888888] mt-0.5 leading-snug">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
