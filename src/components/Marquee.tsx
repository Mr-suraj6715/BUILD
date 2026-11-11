"use client";

import React from "react";

export default function Marquee() {
  const items = [
    { text: "YOUR STYLE. YOUR RULES.", highlight: true },
    { text: "WEAR YOUR IDENTITY.", highlight: false },
    { text: "BUILT DIFFERENT.", highlight: true },
    { text: "HEAVYWEIGHT 280 GSM", highlight: false },
    { text: "TOKYO ARCHIVE", highlight: true },
    { text: "ZERO MASS PRODUCTION", highlight: false },
  ];

  return (
    <section className="w-full bg-[#101010] text-[#F5F3EE] py-3 overflow-hidden select-none border-y border-[#262626]">
      <div className="flex whitespace-nowrap overflow-x-hidden">
        <div className="inline-flex gap-8 items-center animate-marquee">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <span
                className={`font-display text-2xl sm:text-4xl tracking-wider uppercase font-black ${
                  item.highlight ? "text-[#D8FF36]" : "text-[#F5F3EE]"
                }`}
              >
                {item.text}
              </span>
              <span className="text-[#888888] text-xl font-display">★</span>
            </React.Fragment>
          ))}
        </div>
        <div aria-hidden="true" className="inline-flex gap-8 items-center animate-marquee ml-8">
          {items.map((item, idx) => (
            <React.Fragment key={`repeat-${idx}`}>
              <span
                className={`font-display text-2xl sm:text-4xl tracking-wider uppercase font-black ${
                  item.highlight ? "text-[#D8FF36]" : "text-[#F5F3EE]"
                }`}
              >
                {item.text}
              </span>
              <span className="text-[#888888] text-xl font-display">★</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

